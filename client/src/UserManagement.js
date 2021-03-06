import React from 'react';
import AddUser from './user_form.js';
import EditUser from './edit_user';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import Navbar from './navbar.js';
import Footer from './footer.js';
import './footer.css';

class UserManagement extends React.Component {

    state = {
			showEditUserPage : false,
			showUserManagementPage : true		
		}
		
		onGridReady = params => {
			this.gridApi = params.api;
			this.gridColumnApi = params.columnApi;
		}

		setFixedSize = () => {
			this.gridApi.sizeColumnsToFit();
		}

		showAddUserPage = () =>{
			window.location = "/adduser"
		}

		componentDidMount() {

			fetch('/get/users')
			.then(result => result.json())
			.then(rowDataSet => {
				var tempColumnDefs = [];
						
				if(rowDataSet.length > 0)
				{
				var argsCopy = Object.keys(rowDataSet[0])
					console.log(argsCopy)
				for (let i = 0; i < argsCopy.length; i++) {
					if (i !== 0) {
						if(argsCopy[i] !== "password")
						{
							tempColumnDefs.push({
							"headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
							"field": argsCopy[i],
							lockPosition: true
							});
						}
					}
					else {
						tempColumnDefs.push({
						"headerName": argsCopy[i].charAt(0).toUpperCase() + argsCopy[i].slice(1).replace(/([A-Z])/g, ' $1').trim(),
						"field": argsCopy[i],
						lockPosition: true,
						hide: true
						});
					}
        		}

				tempColumnDefs.push({
					headerName: "Edit",
					lockPosition: true,
					cellRendererFramework: () => {
						return  <i className="fa fa-edit fullView" style={{ color: "skyblue" }}></i>
					}
				});
						
				tempColumnDefs.push({
					headerName: "Delete",
					lockPosition: true,
					cellRendererFramework: () => {
						return  <i className="fa fa-trash fullView" style={{ color: "red" }}></i>
					}
				});
						
				this.setState({ rowData: rowDataSet, columnDefs: tempColumnDefs })
				}
			})
		}
		
		onCellClicked = (e) => {
			if(e.colDef.headerName === "Edit")
			{
				this.setState({fields : e.data, showEditUserPage : true, showUserManagementPage : false})
			}
			if(e.colDef.headerName === "Delete")
			{
				fetch('/delete/user', {
					method: 'POST',
					body: JSON.stringify({
						data : e.data._id
					}),
					headers: { "Content-Type": "application/json" }
				})
				.then(() => {
					var rowData = [];
					this.gridApi.forEachNode(function (node) {
						rowData.push(node.data);
					});

					this.gridApi.updateRowData({ remove: [rowData[e.rowIndex]] });
					this.gridApi.redrawRows();
				})
			}
		}

    render(){
			if(this.state.showUserManagementPage === true)
			{
				return(
					<div>
						<Navbar />
						<div className="ag-theme-material" >
						
							<div className="addUser-btn">
								<button className="btn-primary btn" onClick={this.showAddUserPage}><i class="fa fa-plus-circle"></i>&nbsp; Add User</button>
							</div>
								<AgGridReact
								rowHeight ={40}
								columnDefs={this.state.columnDefs}
								rowData={this.state.rowData}
								onCellClicked={this.onCellClicked}
								onGridReady={this.onGridReady}
								onFirstDataRendered={this.setFixedSize}
								animateRows={true}
								>
								</AgGridReact>
						</div>
						<Footer />
					</div>
				)
			}
			if(this.state.showEditUserPage === true)
			{
				return(
					<EditUser fields={this.state.fields} />
				)
			}
    }
}

export default UserManagement;