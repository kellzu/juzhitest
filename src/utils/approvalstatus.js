import { commit, commitToGroup, commitToPrincipal, commitToFinance } from "@/api/approval";

export function formatApprovalStatus(val, type) {
    if (type) {
        switch (val) {
            case "un_commit":
                return "待提交审核";
            case "commit_to_group":
                return "待组长审核";         
            case "commit_to_principal":
                return "待负责人审核";          
            case "commit_to_finance":
                return "待财务审核";     
            case "accomplish":
                return "审批完成";       
            case "cancel":
                return "订单已取消";        
            case "reject":
                return "驳回";       
            default:
                return "待提交审核";
        }
    } else {
        switch (val) {
            case "un_commit":
                return "info";
            case "commit_to_group":
                return "";
            case "commit_to_principal":
                return "";    
            case "commit_to_finance":
                return "";
            case "accomplish":
                return "success";
            case "cancel":
                return "warning";
            case "reject":
                return "danger";
            default:
                return 'info';
        }
    }

}




export function approvalFunc(val, id, data) {
    switch (val) {
        case "un_commit":
            return commit(id, data);
        case "commit_to_group":
            return commitToGroup(id, data);
        case "commit_to_principal":
            return commitToPrincipal(id, data);
        case "commit_to_finance":
            return commitToFinance(id, data);
    }
}