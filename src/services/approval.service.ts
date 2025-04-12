import ApprovalRequest from "../models/approval.model";
import { scheduleNextLayer } from "../utils/approvalLayer";

const levels = ["Senior", "Team Lead", "Manager", "Boss", "CEO", "Final Authority"];

export const escalateIfNotApproved = async (requestId : any, currentLevel : number) => {
  const request = await ApprovalRequest.findById(requestId);

  if (!request || request.status !== "pending") return;

  if (request.approvals[currentLevel].status === "pending") {
    request.approvals[currentLevel].status = "skipped";
    request.approvals[currentLevel].timestamp = new Date();

    if (currentLevel + 1 < levels.length) {
      request.currentLevel = currentLevel + 1;
      await request.save();
      scheduleNextLayer(requestId, currentLevel + 1);
    } else {
      request.status = "rejected";
      await request.save();
    }
  }
};
