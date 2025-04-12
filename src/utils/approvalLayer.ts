import { escalateIfNotApproved } from "../services/approval.service";

export const scheduleNextLayer = (requestId: any, level: number) => {
  setTimeout(() => {
    escalateIfNotApproved(requestId, level);
  }, 60 * 60 * 1000);
};
