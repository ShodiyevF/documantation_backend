namespace AuthInterface {

    //! REGISTER_START

    export interface IRegisterBody {
        user_first_name: string;
        user_last_name: string;
        user_email: string;
        user_password: string;
    }

    //! REGISTER_END


    //! LOGIN_START
    
    export interface ILoginBody {
        user_email: string;
        user_password: string;
    }

    //! LOGIN_END

}

export default AuthInterface