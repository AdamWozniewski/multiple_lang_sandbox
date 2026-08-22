import {LoginRequestDTO} from "./user-login.dto";

export class RegisterRequestDTO extends LoginRequestDTO {
    public confirmPassword: string;

    constructor(data: any) {
        super(data)
        this.confirmPassword = String(data?.confirmPassword ?? "");
    }

    override validate() {
        super.validate();
        if (!this.confirmPassword) {
            throw new Error("Powtórzenie hasła jest wymagane");
        }
        if (this.password !== this.confirmPassword) {
            throw new Error("Hasła muszą być identyczne");
        }
    }
}
