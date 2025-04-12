import { ObjectId } from "mongoose";
import ApprovalRequest from "../models/approval.model";
import { scheduleNextLayer } from "../utils/approvalLayer";
import { Request, Response } from "express";

const levels = ["Senior", "Team Lead", "Manager", "Boss", "CEO", "Final Authority"];

export const createRequest = async (req : Request, res : Response) => {
  const approval = new ApprovalRequest({
    title: req.body.title,
    description: req.body.description,
    approvals: levels.map((role) => ({ role })),
  });

  await approval.save();
  scheduleNextLayer(approval._id, 0);

  res.status(201).json({ message: "Approval request created" });
};

export const approveRequest = async (req : Request, res : Response) : Promise<any> => {
  const { role } = req.body;
  const  requestId  = req.params.id;

  const request = await ApprovalRequest.findById({_id :requestId });
  console.log(request);
  

  if (!request) return res.status(404).send("Request not found");
  if (request.status !== "pending") return res.status(400).send(`Request already ${request.status}`);
  

  const levelIndex = levels.indexOf(role);

  if (request.currentLevel !== levelIndex)
    return res.status(400).send("Not your turn to approve");

  request.approvals[levelIndex].status = "approved";
  request.approvals[levelIndex].timestamp = new Date();
  request.status = "approved";

  await request.save();

  res.json({ message: "Request approved" });
};
