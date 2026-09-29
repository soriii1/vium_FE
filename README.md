# Vium App

Expo Router와 Feature-Based 아키텍처를 기반으로 한 React Native 애플리케이션입니다.

---

## 🛠️ 필수 요구사항

- **Node.js**: v18 이상
- **패키지 매니저**: npm (또는 yarn)
- **모바일 테스트 기기**: [Expo Go](https://expo.dev/go) 앱 설치 필요 (iOS / Android)

<br>

## 🚀 실행 방법

### 1. 의존성 패키지 설치
프로젝트 루트 경로에서 아래 명령어로 필요한 패키지를 설치해 주세요.

npm install

### 2. 개발 서버 시작

npm start

### 3. 앱 실행 및 테스트 방법
개발 서버가 시작되면 터미널에 **QR 코드**와 조작 키 안내가 출력됩니다.

* **📱 실제 모바일 기기에서 테스트 (권장)**
  1. 기기에 **Expo Go** 앱을 설치합니다.
  2. **iOS**: 기본 카메라 앱으로 터미널의 QR 코드를 스캔하여 Expo Go로 열기
  3. **Android**: Expo Go 앱 실행 후 'Scan QR code' 메뉴로 스캔
  *(※ PC와 모바일 기기가 **동일한 Wi-Fi(네트워크)**에 연결되어 있어야 합니다.)*

* **🌐 웹 브라우저에서 테스트**
  * 터미널 창에서 `w` 키 입력

* **🖥️ 시뮬레이터 / 에뮬레이터에서 테스트** *(Xcode / Android Studio 사전 설치 필요)*
  * **iOS (Mac 전용)**: 터미널에서 `i` 키 입력
  * **Android**: 터미널에서 `a` 키 입력


---

## 커밋 컨벤션 (Commit Convention)

커밋 메시지는 `태그: 축약된 설명` 형식으로 작성합니다.

| 태그 | 설명 |
| :--- | :--- |
| **Feat** | 새로운 기능 추가 |
| **Fix** | 버그 수정 |
| **UI** | UI 스타일, 마크업 및 디자인 수정 |
| **Refactor** | 리팩토링 (기능 변경 없이 코드 구조 개선) |
| **Docs** | 문서 수정 (README 등) |
| **Chore** | 빌드 업무, 패키지 매니저 설정, 기타 스타일 수정 없음 |

> **예시**: `Feat: 로그인 화면 UI 및 유효성 검사 추가`

---

## 🏷️ 네이밍 컨벤션 (Naming Convention)

### 1. 브랜치 전략
브랜치는 `태그/기능명` 또는 `태그/#이슈번호-기능명` 형식으로 작성하며 소문자와 하이픈(`-`)을 사용합니다.

| 브랜치 접두사 | 설명 | 예시 |
| :--- | :--- | :--- |
| **main** | 제품 출시 / 배포 가능한 안정 버전 브랜치 | `main` |
| **feat/** | 새로운 기능 개발 브랜치 | `feat/login`, `feat/#12-login` |
| **fix/** | 버그 수정 브랜치 | `fix/header-layout` |
| **refactor/** | 코드 리팩토링 브랜치 | `refactor/auth-hooks` |

### 2. 파일 및 폴더 이름
* **컴포넌트 파일**: `PascalCase` 사용 (예: `UserProfile.tsx`, `Header.tsx`)
* **일반 폴더 / 유틸 / Hook 파일**: `camelCase` 사용 (예: `useAuth.ts`, `formatDate.ts`)
* **기능(feature) 폴더**: `kebab-case` 또는 `camelCase` 사용 (예: `user-profile/`, `auth/`)

### 3. 코드 네이밍
* **컴포넌트 이름**: `PascalCase` (예: `function UserProfile()`)
* **변수 / 함수 / Hook**: `camelCase` (예: `const userData = ...`, `const handleSubmit = ...`)
* **상수 (Constant)**: `SNAKE_CASE` (예: `const API_BASE_URL = ...`)
* **타입 / 인터페이스**: `PascalCase` (예: `type UserProps = ...`, `interface AuthState`)