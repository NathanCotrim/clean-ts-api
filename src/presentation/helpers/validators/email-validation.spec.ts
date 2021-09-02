import { EmailValidation } from './email-validation';
import { EmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors';

interface SutTypes {
    sut: EmailValidation;
    emailValidatorStub: EmailValidator;
}

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
    const sut = new EmailValidation('email', emailValidatorStub);

    return {
        sut,
        emailValidatorStub
    };
};

describe('Email Validation', () => {
    it('should return an error if EmailValidator returns false', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const error = sut.validate({
            email: 'any_email@mail.com'
        });

        expect(error).toEqual(new InvalidParamError('email'));
    });
    it('should call emailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        sut.validate({ email: 'any_email@mail.com' });

        expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
    });

    it('should return 500 if emailValidator throws an exception', () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        expect(sut.validate).toThrow();
    });
});
