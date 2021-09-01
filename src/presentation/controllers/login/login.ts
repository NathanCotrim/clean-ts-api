import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signup-protocols';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
        try {
            const { email, password } = httpRequest.body;

            if (!email) {
                return badRequest(new MissingParamError('email'));
            }

            if (!password) {
                return badRequest(new MissingParamError('password'));
            }

            const emailIsValid = this.emailValidator.isValid(email);

            if (!emailIsValid) {
                return badRequest(new InvalidParamError('email'));
            }

            return new Promise((resolve) =>
                resolve({
                    statusCode: 200,
                    body: ''
                })
            );
        } catch (error) {
            return serverError(error);
        }
    }
}