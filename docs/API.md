# Which API each screen uses

The CareAi .NET API calls behind each portal screen, with a sample request and response for each. The full schemas are in Swagger (the API root `/`).

- **Base URL:** the API address, with no `/v1`.
- **Auth:** `Authorization: Bearer <token>` from sign in. The token lasts 60 minutes; sign in again on `401`.
- **Responses:** every reply is `{ "responseObj": ..., "errorObj": [{ "errorCode", "errorMessage" }] }`. The samples below show `responseObj`; the codes and names in them are examples. `204` means no rows.
- Agents only ever see their own cases.

## Screens and the API they use

| Screen                   | API                                                                  | Purpose                                                                                                                                               |
| ------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign in                  | `POST /Auth/portal-login`                                            | Log in as `AGENT` or `PATIENT`; returns the token                                                                                                     |
| Any page                 | `GET /Auth/portal-me`                                                | Check the session is valid and get the user's name                                                                                                    |
| Patient sign up          | `POST /Auth/patient-signup`                                          | Create a patient account                                                                                                                              |
| Dashboard                | `GET /PortalLead/search`                                             | Get the agent's cases, then count total, active and closed (closed = `statusCd` 329), list what needs action, and search them                         |
| Case Status              | `GET /PortalLead/search`                                             | Get the agent's cases and show the open ones by step (see the last table)                                                                             |
| Action Required          | `GET /PortalLead/search`                                             | Same list: a case needs action if a document code is missing from `documentCds` (ID = 303, medical report = 316) or its `statusCd` is 302, 305 or 310 |
| Upload documents         | `GET /PortalLead/{claimNo}`, `POST /PortalLead/upload-documents`     | Add the missing ID document or medical reports to a case                                                                                              |
| Case Registration (list) | `GET /PortalLead/search?searchBy=&searchVal=`                        | List and search cases                                                                                                                                 |
| New registration         | `POST /PortalLead/register`                                          | Create the case                                                                                                                                       |
|                          | `POST /PortalLead/upload-documents`                                  | Attach the ID document and medical reports                                                                                                            |
| Edit registration        | `GET /PortalLead/{claimNo}`                                          | Load one case to fill the form                                                                                                                        |
|                          | `POST /PortalLead/update`                                            | Save changes (only while the case is still at Registration)                                                                                           |
|                          | `GET /PortalLead/document?claimNo=&fileName=`                        | Open an uploaded file                                                                                                                                 |
| Registration form lists  | `GET /PortalMaster/dropdown`, `/Master/items`, `/Master/code-search` | Fill the form's dropdowns and code search                                                                                                             |

Referral & Invoice and the patient portal pages use demo data and call no API.

## Sample requests and responses

### Sign in: `POST /Auth/portal-login`

```json
{ "User_Type": "AGENT", "Login_Id": "AG001", "Password": "••••••" }
```

`User_Type` is `AGENT` (login id = agent code) or `PATIENT` (login id = member id).

```json
{
  "user_Type": "AGENT",
  "user_Cd": "AG001",
  "user_Full_Name": "Asha Kapoor",
  "email_Id": "asha@example.com",
  "calling_Cd": "+91",
  "mobile_No": "9876543210",
  "token": "eyJ...",
  "expires_At": "2026-11-21T10:00:00Z"
}
```

### Session: `GET /Auth/portal-me`

No body. Returns the same fields as above without `token` and `expires_At`. `401` means the token is invalid or expired.

### Patient sign up: `POST /Auth/patient-signup`

```json
{
  "Full_Name": "Rohan Mehta",
  "Email_Id": "rohan@example.com",
  "Password": "min 6 characters"
}
```

Response: the same profile fields; `user_Cd` is the new login id (member id).

### List cases: `GET /PortalLead/search`

Query: `searchBy` = `Name` | `Email_Id` | `Member_Id`, `searchVal` = text (empty lists all).

```json
[
  {
    "claimNo": "TID262700107",
    "memberId": "MEM26270107",
    "memberName": "Asha Kapoor",
    "treatmentType": "Cardiology",
    "providerNm": "NEO Hospital",
    "caseManager": "CareAI case manager",
    "statusCd": 301,
    "statusNm": "Registration",
    "statusGrp": "301",
    "crtdAt": "2026-11-16T13:11:51",
    "lstUpdtAt": "2026-11-18T13:32:14",
    "documentCds": "303,316"
  }
]
```

### One case: `GET /PortalLead/{claimNo}`

Returns the search fields plus every registration field as a code and its name, and the uploaded documents:

```json
{
  "claimNo": "TID262700107",
  "memberId": "MEM26270107",
  "firstName": "Asha",
  "gender": "F",
  "nationality": "IN",
  "nationalityNm": "India",
  "treatmentType": "TT01",
  "treatmentTypeNm": "Cardiology",
  "providerCd": "PRV01",
  "providerNm": "NEO Hospital",
  "statusNm": "Registration",
  "statusGrp": "301",
  "documents": [
    { "docNm": "ID Document", "fileName": "passport.pdf", "docCd": "303" }
  ]
}
```

`204` when the case does not exist or belongs to another agent.

### Register: `POST /PortalLead/register`

```json
{
  "FirstName": "Asha",
  "LastName": "Kapoor",
  "EmailId": "asha@example.com",
  "Dob": "1990-01-15",
  "Gender": "F",
  "Nationality": "IN",
  "CallingCd": "+91",
  "MobileNo": "9876543210",
  "LeadType": "Normal",
  "PatientLocation": "IN",
  "DocumentType": "303",
  "DocumentNo": "P1234567",
  "TreatmentType": "TT01",
  "Department": "D01",
  "ProviderCd": "PRV01",
  "BranchCd": "B01",
  "DoctorCd": "DR01",
  "Diagnosis": "...",
  "Treatment": "...",
  "CaseNote": "...",
  "IcdCode": "I10",
  "IcdDesc": "Essential hypertension",
  "CptCode": "99213",
  "CptDesc": "Office visit",
  "PaymentMode": "PM01",
  "Guarantor": "G01"
}
```

- **Required:** `FirstName`, `Gender`, `CallingCd`, `PatientLocation`, `DocumentType`, `DocumentNo`, `TreatmentType`, `PaymentMode`. The others are optional (`MiddleName` also exists).
- **Rules:** names, `EmailId` and `DocumentNo` at most 50 characters; `CallingCd` like `+91`; `MobileNo` digits only, up to 10; `Dob` a past date `yyyy-MM-dd`.
- **Codes:** the values for gender, location, treatment and so on come from the form lists below.

```json
{ "member_Id": "MEM26270107", "claim_No": "TID262700107" }
```

### Update: `POST /PortalLead/update`

The same body as register, plus `"ClaimNo": "TID262700107"`. Response is the same as register.

### Upload documents: `POST /PortalLead/upload-documents`

`multipart/form-data`:

| Field            | Value                     |
| ---------------- | ------------------------- |
| `claimNo`        | `claim_No` from register  |
| `memberId`       | `member_Id` from register |
| `idDocument`     | one file                  |
| `medicalReports` | any number of files       |

Files: `.pdf .jpg .jpeg .png .doc .docx`, at most 10 MB each, not empty.

```json
{ "uploaded": ["passport.pdf"], "errors": [] }
```

### Download a file: `GET /PortalLead/document?claimNo=&fileName=`

Returns the file itself (not JSON). `404` if the file is not on that case.

### Form lists

All return a list of `{ "value", "text" }`. Send `value` in the case.

| API                                                                       | Gives                           |
| ------------------------------------------------------------------------- | ------------------------------- |
| `GET /PortalMaster/dropdown?mode=ddlNationality`                          | Nationalities                   |
| `GET /PortalMaster/dropdown?mode=ddlPatientLocation`                      | Patient locations               |
| `GET /PortalMaster/dropdown?mode=ddlProvider`                             | Hospitals                       |
| `GET /PortalMaster/dropdown?mode=ddlDocumentType&filterId=LEAD_ID`        | ID document types               |
| `GET /PortalMaster/dropdown?mode=DrpBranch&filterId=<hospital>`           | Branches of a hospital          |
| `GET /PortalMaster/dropdown?mode=drpDoctor&filterId=<hospital>`           | Doctors of a hospital           |
| `GET /PortalMaster/dropdown?mode=drpGuarantor&filterId=<payment mode>`    | Guarantors for a payment mode   |
| `GET /Master/items?itemType=Gender`                                       | Genders                         |
| `GET /Master/items?itemType=TreatmentType`                                | Treatment types                 |
| `GET /Master/items?itemType=ProviderDepartment&filterId=<treatment type>` | Departments of a treatment type |
| `GET /Master/items?itemType=PaymentMode`                                  | Payment modes                   |

```json
[{ "value": "IN", "text": "India" }]
```

`/PortalMaster/dropdown` needs the agent token; `/Master/items` needs none.

### Code search: `GET /Master/code-search?type=ICD&q=hypertension`

`type` is `ICD` or `CPT`; `q` is up to 50 characters. No token needed.

```json
[{ "cd": "I10", "nm": "Essential hypertension" }]
```

Send `cd` as `IcdCode` / `CptCode` and `nm` as `IcdDesc` / `CptDesc`.

## Case status steps

From the case's `statusGrp`:

| Step                 | `statusGrp`                            |
| -------------------- | -------------------------------------- |
| Registration         | 301 (the only group an agent can edit) |
| Estimate             | 304                                    |
| Travel & Appointment | 318                                    |
| Treatment            | 322                                    |
| Discharge & Claim    | 324, 330                               |

A case is closed when `statusCd` is 329 (Claim Submitted). Closed cases are left off the Case Status list and only counted on the Dashboard.
