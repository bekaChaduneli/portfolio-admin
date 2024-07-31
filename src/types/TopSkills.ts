export interface ITopSkillsTranslation {
  id: string;
  linkedinName: string;
  languageCode: string;
  name: string;
  topSkillsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITopSkills {
  id: string;
  linkedinId: string;
  translations: ITopSkillsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface ITopSkillsResponse {
  findManyTopSkills: ITopSkills;
}