import { Employee } from "./employees";
import { Position } from "./position";

export interface JobChangeRequestWrite {
    employee:string;
    current_position:string;
    desired_position:string;
    reason?:string |null;
    request_type: 'Promotion' | 'Demotion' | 'Transfer';
    status:'Pending' | 'Approved' | 'Rejected';
}

export interface JobChangeRequestRead {
    guid : string;
    employee:Employee;
    current_position:Position;
    desired_position:Position;
    reason?:string |null;
    request_type: 'Promotion' | 'Demotion' | 'Transfer';
    status:'Pending' | 'Approved' | 'Rejected';
}