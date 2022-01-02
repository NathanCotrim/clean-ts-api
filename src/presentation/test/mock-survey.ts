import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModels } from '@/domain/test';
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys';

import {
    AddSurvey,
    AddSurveyParams
} from '@/domain/usecases/survey/add-survey';

export const mockAddSurvey = (): AddSurvey => {
    class AddSurveyStub implements AddSurvey {
        async add(data: AddSurveyParams): Promise<void> {
            return new Promise((resolve) => resolve());
        }
    }

    return new AddSurveyStub();
};

export const mockLoadSurveys = (): LoadSurveys => {
    class LoadSurveysStub implements LoadSurveys {
        async load(): Promise<SurveyModel[]> {
            return new Promise((resolve) => resolve(mockSurveyModels()));
        }
    }

    return new LoadSurveysStub();
};