import React from 'react';
import './Bag.scss';
import TickerBagList from '../bag/list/List';
import TickerBagCreate from '../bag/create/Create';
import TickerBagUpdate from '../bag/update/Update';
import { Redirect, Route, Switch, Link} from 'react-router-dom';

class Manager extends React.Component {

    
    routes = () =>{
        return  <Switch>
            <Route  path="/ticket-bag-create" component={TickerBagCreate}></Route>
            <Route  path="/ticket-bag-update" component={TickerBagUpdate}></Route>
            <Route  path="/ticket-bag" component={TickerBagList}></Route>
            <Redirect to="/ticket-bag"/>
        </Switch>
    }

	render() {
        const create = this.props.location.pathname==="/ticket-bag-create"?"flex":"none";
        const update = this.props.location.pathname==="/ticket-bag-update"?"flex":"none";
		return (
			<div className="ticket-manage-container">
				<div className="ticket-manage-breadcrumb-box">
                    <span>优惠券 </span>
                    <Link to="/ticket-bag">/ 洗车券包管理 </Link>
                    <Link to="/ticket-bag-create" style={{display:create}}>/ 新增洗车券包</Link>
                    <Link to="/ticket-bag-update" style={{display:update}}>/ 修改洗车券包</Link>
                </div>
                <div className="ticket-manage-routes">
                    {this.routes()}
                </div>
			</div>
		);
	}


}

export default Manager;
