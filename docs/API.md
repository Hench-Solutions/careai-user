# Portal API reference

CareAi .NET API used by the agent portal. Full schemas: Swagger at the API root (`/`).

- **Base URL:** host only (no `/v1` prefix on these routes).
- **Auth:** `Authorization: Bearer <token>` from `POST /Auth/portal-login`. Token lifetime is `AppSettings:JwtExpiryMinutes` (**1440** = 24 hours); login returns `expires_At`. Sign in again on `401`. The CareAi portal web keeps the token in an httpOnly cookie whose `max-age` matches the JWT `exp` claim; other clients send the Bearer header directly.
- **Envelope:** `{ "responseObj", "errorObj": [{ "errorCode", "errorMessage" }] }`. Samples show `responseObj` only. `errorCode` **1** (no records) maps to HTTP `204`.

## Screens → endpoints

| Screen | Calls |
| ------ | ----- |
| Sign in | `POST /Auth/portal-login` |
| Session | `GET /Auth/portal-me` |
| Patient sign up | `POST /Auth/patient-signup` |
| Dashboard, Case Status, Action Required, registration list | `GET /PortalLead/search` |
| Upload / edit case | `GET /PortalLead/{claimNo}`, `POST /PortalLead/upload-documents`, `POST /PortalLead/update` |
| New case | `POST /PortalLead/register`, then upload |
| File download | `GET /PortalLead/document?claimNo=&fileName=` |
| Form dropdowns | `GET /PortalMaster/dropdown`, `GET /Master/items`, `GET /Master/code-search` |

Referral & Invoice and patient-only demo pages: no API.

`PortalLead` routes scope data to the signed-in agent: stored leads use `Source` = `SR0001` and `Insurer_Cd` equal to the agent code from the token. Another agent's `claimNo` returns no records; document upload returns `404`.

## Endpoints

### `POST /Auth/portal-login`

```json
{ "User_Type": "AGENT", "Login_Id": "AG001", "Password": "••••••" }
```

`User_Type`: `AGENT` or `PATIENT`. For agents, `Login_Id` is `Agent_Cd` or `Email_Id` (trimmed match on `MT_Agent`). For patients, `Login_Id` is `Member_Id`.

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

### `GET /Auth/portal-me`

Same profile fields as login, without `token` or `expires_At`.

### `POST /Auth/patient-signup`

```json
{
  "Full_Name": "Rohan Mehta",
  "Email_Id": "rohan@example.com",
  "Password": "min 6 characters"
}
```

Response: profile fields; `user_Cd` is the new `Member_Id`.

### `GET /PortalLead/search`

Query: `searchBy` = `Name` | `Email_Id` | `Member_Id`, `searchVal` (empty = all agent leads).

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

Portal UI treats `statusCd` 329 as closed, flags cases needing action when `documentCds` lacks `303` or `316` or `statusCd` is 302, 305, or 310.

### `GET /PortalLead/{claimNo}`

Search row fields plus full registration codes and names, and `documents[]`. HTTP `204` when the claim is missing or not owned by this agent.

### `POST /PortalLead/register`

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
  "InsurerCd": "AG001",
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

**Required:** `FirstName`, `Gender`, `CallingCd`, `PatientLocation`, `DocumentType`, `DocumentNo`, `TreatmentType`, `PaymentMode` (`MiddleName` optional).

**Validation:** name, `EmailId`, and `DocumentNo` max 50 characters; `CallingCd` like `+91`; `MobileNo` digits only, max 10; `Dob` a past date (`yyyy-MM-dd`). Code fields use dropdown `value`s from the form lists below.

`AgentCd` and `Source` (`SR0001`) come from the token; client values for those fields are ignored. `InsurerCd` is filled from the token when empty; when sent, it must equal the signed-in agent or the API returns `errorCode` **644** (*InsurerCd must match the signed-in agent.*).

```json
{ "member_Id": "MEM26270107", "claim_No": "TID262700107" }
```

### `POST /PortalLead/update`

Same JSON body as register plus `"ClaimNo"`. Allowed only while the lead's `statusGrp` is `301`.

### `POST /PortalLead/upload-documents`

`multipart/form-data`. Field names match `UploadDocumentsRequest` (camelCase).

| Field | Notes |
| ----- | ----- |
| `claimNo`, `memberId` | From register response |
| `idDocument` | Optional if medical files are included |
| `idDocCd`, `idDocNm` | Required when `idDocument` is sent (`idDocCd` > 0); portal uses `303` and `ID Document` by default |
| `medicalReports` | One or more files |
| `medicalDocCd`, `medicalDocNm` | Required when any medical file is sent (`medicalDocCd` > 0); portal uses `316` and `Medical Report` by default |

Allowed types: `.pdf .jpg .jpeg .png .doc .docx`; max 10 MB per file; files must be non-empty. At least one of `idDocument` or `medicalReports` is required. Case must belong to the agent (`claimNo` / `memberId` match).

```json
{ "uploaded": ["passport.pdf"], "errors": [] }
```

### `GET /PortalLead/document?claimNo=&fileName=`

Returns the file (not JSON). `404` if the file is not on that agent's case.

### Form lists

Responses are `{ "value", "text" }[]`; send `value` in register/update.

| Endpoint | Use |
| -------- | --- |
| `GET /PortalMaster/dropdown?mode=ddlNationality` | Nationality |
| `GET /PortalMaster/dropdown?mode=ddlPatientLocation` | Patient location |
| `GET /PortalMaster/dropdown?mode=ddlProvider` | Hospitals |
| `GET /PortalMaster/dropdown?mode=ddlDocumentType&filterId=LEAD_ID` | ID document types |
| `GET /PortalMaster/dropdown?mode=DrpBranch&filterId=<hospital>` | Branches |
| `GET /PortalMaster/dropdown?mode=drpDoctor&filterId=<hospital>` | Doctors |
| `GET /PortalMaster/dropdown?mode=drpGuarantor&filterId=<payment mode>` | Guarantors |
| `GET /Master/items?itemType=Gender` | Gender |
| `GET /Master/items?itemType=TreatmentType` | Treatment types |
| `GET /Master/items?itemType=ProviderDepartment&filterId=<treatment>` | Departments |
| `GET /Master/items?itemType=PaymentMode` | Payment modes |

`GET /PortalMaster/dropdown` requires the agent token; `GET /Master/items` does not.

### `GET /Master/code-search?type=ICD&q=hypertension`

`type` is `ICD` or `CPT`; `q` up to 50 characters. Returns `[{ "cd", "nm" }]`. Map to `IcdCode` / `IcdDesc` or `CptCode` / `CptDesc` on the case body.

## Case status (`statusGrp`)

| Step | `statusGrp` |
| ---- | ----------- |
| Registration (agent may edit) | 301 |
| Estimate | 304 |
| Travel & Appointment | 318 |
| Treatment | 322 |
| Discharge & Claim | 324, 330 |

`statusCd` **329** (Claim Submitted) is closed: omitted from Case Status, counted on the Dashboard.