export const ROLES = ['admin', 'team', 'client'] as const;

export const TEAM_TYPES = ['architect', 'engineer', 'designer', 'consultant'] as const;

export const TEAM_TYPE_LABELS: Record<string, string> = {
  architect: 'Architect',
  engineer: 'Engineer', 
  designer: 'Designer',
  consultant: 'Consultant',
};

export type Role = typeof ROLES[number];
export type TeamType = typeof TEAM_TYPES[number];