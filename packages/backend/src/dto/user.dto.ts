export class LoginRequestDTO {
  public email: string;
  public password: string;

  constructor(data: any) {
    this.email = String(data?.email ?? "").trim().toLowerCase();
    this.password = String(data?.password ?? "");
  }

  validate() {
    if (!this.email) throw new Error("Email jest wymagany");
    if (!this.email.includes("@")) throw new Error("Email jest niepoprawny");
    if (!this.password) throw new Error("Hasło jest wymagane");
  }
}