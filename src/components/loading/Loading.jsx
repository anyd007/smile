import { Bars } from 'react-loader-spinner'
import "./Loading.scss";

const Loading = () => {
    return ( 
         <div className="loeader-component">
            <Bars className="loader"
            color='black'
            width="150"
            height="150"/>
        </div>
     );
}
 
export default Loading;