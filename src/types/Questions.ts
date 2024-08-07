export interface IQuestionsTranslation {
  id: string;
  languageCode: string;
  answer: string;
  question: string;
  questionsId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IQuestions {
  id: string;
  profileId: string;
  translations: IQuestionsTranslation[];
  createdAt: string;
  updatedAt: string;
}

export interface IQuestionsResponse {
  findManyQuestions: IQuestions;
}

export interface QuestionInitialValues {
  enQuestion: string | undefined;
  kaQuestion: string | undefined;
  enAnswer: string | undefined;
  kaAnswer: string | undefined;
}
