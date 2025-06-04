# multiple_lang_sandbox
Aplikacja składająca się z kilku technologii zamkniętej w monorepo

# Terraform:
```terraform init```

terraform plan

terraform apply

terraform destroy

- [ ] Backend NodeJS
- [ ] Frontend React
- [ ] React Native
- [ ] React Native Desktop


## 🔐 Dwuskładnikowe uwierzytelnianie (2FA)

- [X] Kod email (2FA przez e-mail)
- [ ] QR Core (generowanie i weryfikacja kodów QR)
- [ ] Magic Link
- [ ] Odcisk palca (biometryczne uwierzytelnianie)
- [ ] Klucz Yubico (wsparcie dla fizycznych kluczy bezpieczeństwa)

## 🗄 Baza danych

- [ ] Zdublowanie modeli z MongoDB do SQL (przeniesienie lub synchroniczne współistnienie modeli)
- [ ] Ujednolicenie schematów danych w obu bazach

## 🌐 API i Routing

- [ ] Zdublowanie klasycznych routów w API (RESTful)
- [ ] Dodanie GraphQL jako alternatywnego interfejsu
- [ ] Zmapowanie istniejącego API na GraphQL (resolvery, typy, itd.)

## 🧪 Testowanie

### Unit Tests
- [ ] Dodanie testu jednostkowego do logiki 2FA
- [ ] Dodanie testu jednostkowego do walidatora danych
- [ ] Dodanie testu jednostkowego dla resolvera GraphQL

### Integration Tests
- [ ] Test integracyjny dla MongoDB ↔ SQL synchronizacji
- [ ] Test integracyjny dla pełnej ścieżki uwierzytelniania
- [ ] Test integracyjny dla API → GraphQL

### End-to-End Tests (E2E)
- [ ] E2E test logowania z 2FA (kod email)
- [ ] E2E test rejestracji i logowania z kluczem Yubico
- [ ] E2E test odpytywania danych użytkownika przez GraphQL