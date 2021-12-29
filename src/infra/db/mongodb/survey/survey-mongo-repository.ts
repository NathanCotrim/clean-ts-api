/* eslint-disable @typescript-eslint/brace-style */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { LoadSurveysRepository } from '@/data/protocols/db/survey/load-surveys-repository';
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id-protocols';
import { SurveyModel } from '@/domain/models/survey';
import { AddSurveyModel } from '@/domain/usecases/add-survey';
import { ObjectId } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';

export class SurveyMongoRepository
    implements
        AddSurveyRepository,
        LoadSurveysRepository,
        LoadSurveyByIdRepository
{
    async loadById(id: string): Promise<SurveyModel> {
        const surveyCollection = await MongoHelper.getCollection('surveys');
        const survey = (await surveyCollection.findOne({
            _id: new ObjectId(id)
        })) as SurveyModel;

        return survey;
    }

    async add(surveyData: AddSurveyModel): Promise<void> {
        const surveyCollection = await MongoHelper.getCollection('surveys');
        await surveyCollection.insertOne(surveyData);
    }

    async loadAll(): Promise<SurveyModel[]> {
        const surveyCollection = await MongoHelper.getCollection('surveys');

        const surveys = await surveyCollection.find({}).toArray();

        return surveys as SurveyModel[];
    }
}
