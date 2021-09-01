import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { EmailValidator, HttpRequest } from '../signup/signup-protocols';
import { LoginController } from './login';

describe('Login Controller', () => {
    interface SutTypes {
        sut: LoginController;
        emailValidatorStub: EmailValidator;
    }

    const makeFakeRequest = (): HttpRequest => ({
        body: {
            email: 'any_email@mail.com',
            password: 'any_valid'
        }
    });

    const makeEmailValidator = (): EmailValidator => {
        class EmailValidatorStub implements EmailValidator {
            isValid(email: string): boolean {
                return true;
            }
        }

        return new EmailValidatorStub();
    };

    const makeSut = (): SutTypes => {
        const emailValidatorStub = makeEmailValidator();
        const sut = new LoginController(emailValidatorStub);

        return {
            sut,
            emailValidatorStub
        };
    };

    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                password: 'any_password'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('email'))
        );
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const httpRequest = {
            body: {
                email: 'any_email'
            }
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual(
            badRequest(new MissingParamError('password'))
        );
    });

    it('should return 400 if an invalid email is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(
            badRequest(new InvalidParamError('email'))
        );
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        await sut.handle(makeFakeRequest());
        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const httpResponse = await sut.handle(makeFakeRequest());
        expect(httpResponse).toEqual(serverError(new Error()));
    });
});