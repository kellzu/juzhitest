import { commit, commitToGroup, commitToPrincipal, commitToFinance, purchaseCancel, rejectPurchaseOrder } from "@/api/approvalPurchase";

export function formatApprovalStatus(val) {
    switch (val) {
        case "un_commit":
            return "提交审核";
            break;
        case "commit_to_group":
            return "组长审核";
            break;
        case "commit_to_principal":
            return "负责人审核";
            break;
        case "commit_to_finance":
            return "财务审核";
            break;
        case "accomplish":
            return "审批完成";
            break;
        case "cancel":
            return "订单已取消";
            break;
        case "reject":
            return "驳回";
            break;
        default:
            return "待提交审核";
    }
}

export function formatApprovalType(val) {
    switch (val) {
        case "un_commit":
            return "info";
            break;
        case "commit_to_group":
            return "";
            break;
        case "commit_to_principal":
            return "";
            break;
        case "commit_to_finance":
            return "";
            break;
        case "accomplish":
            return "success";
            break;
        case "cancel":
            return "warning";
            break;
        case "reject":
            return "danger";
            break;
        default:
            return 'info';
    }
}

export function approvalFunc(val, id, data) {
    switch (val) {
        case "un_commit":
            return commit(id, data);
            break;
        case "commit_to_group":
            return commitToGroup(id, data);
            break;
        case "commit_to_principal":
            return commitToPrincipal(id, data);
            break;
        case "commit_to_finance":
            return commitToFinance(id, data);
            break;
        case "cancel":
            return purchaseCancel(id, data);
            break;
        case "reject":
            return rejectPurchaseOrder(id,data);
            break;
    }
}