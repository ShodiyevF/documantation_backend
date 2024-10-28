namespace AuthInterface {

    export interface IRegisterBody {
        user_first_name: string;
        user_last_name: string;
        user_email: string;
        user_password: string;
    }

    export interface ILoginBody {
        user_email: string;
        user_password: string;
    }

}

export default AuthInterface