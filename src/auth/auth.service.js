
class RegisterService {
    async registerUser(email, nickname, hashedPassword) {
      // 회원가입 로직
      // 데이터베이스에 사용자를 추가하는 코드
  
    }
  
    async findUser(email) {
      // 주어진 이메일> 사용자를 찾는 로직
  
    }
  }
  


class LoginService {
    async authenticateUser(email, password) {
      // 사용자 인증 로직
      // 비밀번호 일치 확인, 인증 토큰 생성
  

    }
  }
  



// auth.service.js 파일
module.exports = {
    RegisterService,
    LoginService,
  };
  