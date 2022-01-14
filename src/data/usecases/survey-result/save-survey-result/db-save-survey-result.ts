import { LoadSurveyResultRepository } from '../load-survey-result/db-load-survey-result-protocols';
import {
    SaveSurveyResult,
    SaveSurveyResultParams,
    SaveSurveyResultRepository,
    SurveyResultModel
} from './db-save-survey-result-protocols';

export class DbSaveSurveyResult implements SaveSurveyResult {
    constructor(
        private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
        private readonly loadSurveyResultRepositoryStub: LoadSurveyResultRepository
    ) {}

    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
        await this.saveSurveyResultRepository.save(data);

        const surveyResult =
            await this.loadSurveyResultRepositoryStub.loadBySurveyId(
                data.surveyId
            );

        return surveyResult;
    }
}
