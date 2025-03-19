export interface MappingConfiguration {
    mapping_id?: string;
    configurations: string[];
}

export interface Configuration {
    modified_by: string;
    created_on: string;
    modified_on: string;
    schedule_research_update: boolean;
    search_builder: boolean;
    user_management: boolean;
    non_english: boolean;
    system_management: boolean;
    is_active: boolean;
    created_by: string;
    id: string;
    mapping_id: string;
    email: boolean;
    full_text_attachment: boolean;
    audit_log: boolean;
    e2b_xml: boolean;
    export_files: boolean;
}