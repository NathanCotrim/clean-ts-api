import { AuthenticationModel } from './../../../domain/usecases/authentication';
/* eslint-disable @typescript-eslint/brace-style */
import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { AccountModel } from './../../../domain/models/account';
import { DbAuthentication } from './db-authentication';
describe('DbAuthentication', () => {
    interface SutTypes {
        sut: DbAuthentication;
        loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    }

    const makeFakeAuthentication = (): AuthenticationModel => ({
        email: 'any_email@mail.com',
        password: 'any_password'
    });

    const makeFakeAccount = (): AccountModel => ({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
    });

    const makeLoadAccountByEmailRepositoryStub =
        (): LoadAccountByEmailRepository => {
            class LoadAccountByEmailRepositoryStub
                implements LoadAccountByEmailRepository
            {
                async load(email: string): Promise<AccountModel> {
                    return new Promise((resolve) => resolve(makeFakeAccount()));
                }
            }

            return new LoadAccountByEmailRepositoryStub();
        };

    const makeSut = (): SutTypes => {
        const loadAccountByEmailRepositoryStub =
            makeLoadAccountByEmailRepositoryStub();
        const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

        return {
            sut,
            loadAccountByEmailRepositoryStub
        };
    };

    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
        await sut.auth(makeFakeAuthentication());
        expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should throw if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load'
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => reject(new Error()))
        );
        const promise = sut.auth(makeFakeAuthentication());
        await expect(promise).rejects.toThrow();
    });

    it('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load'
        ).mockReturnValueOnce(new Promise((resolve) => resolve('')));
        const accessToken = await sut.auth(makeFakeAuthentication());
        expect(accessToken).toBeFalsy();
    });
});
