import { VacancyRead } from "./vacancies";

export interface CandidateWrite {
    vacancy: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    resume?: File;
    cover_letter?: string;
    status?: string;
    score?: number;
    recruiter?: string;
    interviwer?: string;
    notes?: string;
    expected_salary?: number;
    source_channel?: string;
}

export interface CandidateRead {
    guid: string;
    vacancy: VacancyRead;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
    resume?: string;
    cover_letter?: string;
    status?: string;
    score?: number;
    recruiter?: string;
    interviwer?: string;
    notes?: string;
    expected_salary?: number;
    source_channel?: string;
}