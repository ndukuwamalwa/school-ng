import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { SessionService } from 'src/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginMessage = '';
  loginError = false;
  passwordChangeMessage = '';
  passwordChangeError = false;
  username = 'ADMIN';
  resetPassMessage = '';
  resetPassError = false;
  loginPage = true;
  changePage = false;
  resetPage = false;
  resetSuccessful = false;
  isLogingIn = false;
  isChangingPassword = false;
  isResetingPassword = false;

  constructor(
    private apollo: Apollo,
    private sessionService: SessionService
  ) { }

  ngOnInit(): void {
  }

  login({ username, password }: { username: string, password: string }): void {
    this.loginError = false;
    this.isLogingIn = true;
    this.apollo.mutate({
      mutation: gql`
      mutation m {
        login(username: "${username}", password: "${password}") {
          statusCode
          token,
          accessAreas
        }
      }
      `,
      errorPolicy: 'all',
    })
      .subscribe((res) => {
        if (res.errors) {
          this.loginError = true;
          this.loginMessage = 'Server Error.';
        } else {
          const response: { statusCode: number, token: string, accessAreas: Array<string> } = (res.data as any).login;
          const result = response.statusCode;
          if (result === 1) {
            // Login successful
            if (response.accessAreas.length === 0) {
              this.loginError = true;
              this.loginMessage = 'Login Successful but no roles assigned';
            } else {
              this.sessionService.login(response.token, response.accessAreas);
            }
          } else if (result === 2) {
            // Change Password
            this.loginPage = false;
            this.changePage = true;
            this.resetPage = false;
          } else {
            // Invalid credentials
            this.loginError = true;
            this.loginMessage = 'Invalid username or password';
          }
        }
        this.disableLoaders();
      }, err => {
        this.loginError = true;
        this.loginMessage = 'Server Error.';
        this.disableLoaders();
      });
  }

  onInputChange(): void {
    this.loginError = false;
    this.loginMessage = '';
  }

  onChangePassword({ newPass, confirmPass }: { newPass: string, confirmPass: string }): void {
    this.passwordChangeError = false;
    this.passwordChangeMessage = '';

    if (newPass !== confirmPass) {
      this.passwordChangeError = true;
      this.passwordChangeMessage = 'Passwords Do Not Match';
      return;
    }
    this.isChangingPassword = true;
    this.apollo.mutate({
      mutation: gql`
      mutation m {
        changePassword(username: "${this.username}", password: "${confirmPass}")
      }
      `,
      errorPolicy: 'all'
    })
      .subscribe(res => {
        if (res.errors) {
          this.passwordChangeError = true;
          this.passwordChangeMessage = 'Server Error.';
        } else {
          const result = (res.data as any).changePassword as number;
          if (result === 1) {
            // Successful
            this.login({ username: this.username, password: confirmPass });
          } else if (result === 2) {
            // Insecure Password
            this.passwordChangeError = true;
            this.passwordChangeMessage = `You password must be atleat 8 characters long and contain atleast one of each of the following:
            an uppercase letter, a lowercase letter, a number and a special character `;
          } else if (result === 3) {
            // Overused password
            this.passwordChangeError = true;
            this.passwordChangeMessage = 'You cannot reuse an old password';
          } else {
            // Failure
            this.passwordChangeError = true;
            this.passwordChangeMessage = 'Error changing password';
          }
        }
        this.disableLoaders();
      }, err => {
        this.passwordChangeError = true;
        this.passwordChangeMessage = 'Server Error.';
        this.disableLoaders();
      });
  }

  onResetPassword({ email }: { email: string }): void {
    this.resetPassError = true;
    this.isResetingPassword = true;
    this.resetPassMessage = '';
    this.apollo.mutate({
      mutation: gql`
      mutation m {
        resetPassword(email: "${email}")
      }
      `,
      errorPolicy: 'all'
    })
      .subscribe(res => {
        if (res.errors) {
          this.resetPassError = true;
          this.resetPassMessage = 'Server Error';
        } else {
          const result = (res.data as any).resetPassword as number;
          if (result === 1) {
            // Success
            this.resetSuccessful = true;
          } else if (result === 2) {
            // Invalid Email
          } else {
            this.resetPassError = true;
            this.resetPassMessage = 'Problem Reseting Password';
          }
        }
        this.disableLoaders();
      }, err => {
        this.resetPassError = true;
        this.resetPassMessage = 'Server Error';
        this.disableLoaders();
      });
  }

  showResetPass(): void {
    this.loginPage = false;
    this.changePage = false;
    this.resetPage = true;
    this.disableLoaders();
  }

  showLoginPage(): void {
    this.loginPage = true;
    this.changePage = false;
    this.resetPage = false;
    this.resetSuccessful = false;
    this.disableLoaders();
  }

  private disableLoaders(): void {
    this.isLogingIn = false;
    this.isChangingPassword = false;
    this.isResetingPassword = false;
  }

  onPassReentry(): void {
    this.passwordChangeError = false;
    this.passwordChangeMessage = '';
  }

}
