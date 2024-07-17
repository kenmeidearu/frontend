/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
//material modal
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

// Axios for API requests
import axios from "axios";
import { useState, useEffect } from "react";
import { getIsAdminFromToken } from '../../utils/authUtils';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80%',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
function Tables() {
  const isAdmin = getIsAdminFromToken();

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  //untuk modal anggota
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [updateStatusData, setUpdateStatusData] = useState({
    status: 'active',
    renewalYear: 1,
    renewalDate: new Date().toISOString().split('T')[0], // Default to today's date
  });
  
  const handleOpenUpdateStatusModal = (member) => {
    setUpdateStatusData({
      id: member.id,
      status: member.status === 'active' ? 'active' : 'non-active',
      renewalYear:1,
      renewalDate: new Date().toISOString().split('T')[0],
    });
    setIsUpdateStatusModalOpen(true);
  };
  
  const handleCloseUpdateStatusModal = () => setIsUpdateStatusModalOpen(false);
  
  const handleUpdateStatusChange = (event) => {
    const { name, value } = event.target;
    setUpdateStatusData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleUpdateStatusSubmit = () => {
    axios.put(`http://localhost:3001/api/members/${updateStatusData.id}`, updateStatusData)
      .then(response => {
        fetchData(page, searchQuery);
        handleCloseUpdateStatusModal();
      })
      .catch(error => console.error('Error updating member status:', error));
  };
  
  //end modal anggota
  //untuk modal
// Add these state variables inside the Tables component
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: 0,
    memberNumber: "",
    memberName:"",
    region: "",
    carPlate: "",
    carYear: "",
    phoneNumber: "",
    email: "",
    status: "",
    joinDate: "",
  });
  const [formErrors, setFormErrors] = useState({
    memberNumber: false,
    memberName: false,
    region: false,
    carPlate: false,
    carYear: false,
    phoneNumber: false,
    email: false,
  });

  // Function to handle opening the modal
  const handleOpenModal = (data = {}) => {
    setFormData({
      id: data.id ||0,
      memberNumber: data.memberNumber || "",
      memberName: data.memberName || "",
      region: data.region || "",
      carPlate: data.carPlate || "",
      carYear: data.carYear || "",
      phoneNumber: data.phoneNumber || "",
      email: data.email || "",
      status: data.status || "active",
      joinDate: data.joinDate || new Date().toISOString().substr(0, 10),
    });
    setIsModalOpen(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      id:0,
      memberNumber: "",
      memberName: "",
      region: "",
      carPlate: "",
      carYear: "",
      phoneNumber: "",
      email: "",
      status: "",
      joinDate: "",
    });
    setFormErrors({
      memberNumber: false,
      memberName: false,
      region: false,
      carPlate: false,
      carYear: false,
      phoneNumber: false,
      email: false,
    });
  };
  // Function to handle form data change
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Function to handle form submission for Create or Update
  const handleFormSubmit = () => {
    // Validation
    const errors = {};
    let hasError = false;
    Object.keys(formData).forEach((key) => {
      if (typeof formData[key] === 'string' && formData[key].trim() === "" && key !== 'id') {
        errors[key] = true;
        hasError = true;
      } else if (!formData[key] && key !== 'id' && key !== 'carYear' && key !== 'phoneNumber' && key !== 'email') {
        errors[key] = true;
        hasError = true;
      }
    });

    if (hasError) {
      setFormErrors(errors);
      return;
    }

    // Handle form submit logic here
    if (formData.id>0) {
      // Update member logic
      axios.put(`http://localhost:3001/api/members/${formData.id}`, formData)
        .then(response => {
          fetchData(page, searchQuery);
          handleCloseModal();
        })
        .catch(error => console.error('Error updating member data:', error));
    } else {
      // Create new member logic
      axios.post(`http://localhost:3001/api/members`, formData)
        .then(response => {
          fetchData(page, searchQuery);
          handleCloseModal();
        })
        .catch(error => console.error('Error creating new member:', error));
    }
    handleCloseModal();
  };

  // Function to handle Delete operation
  const handleDelete = (memberNumber) => {
    axios.delete(`http://localhost:3001/api/members/${memberNumber}`)
      .then(response => fetchData(page, searchQuery))
      .catch(error => console.error('Error deleting member data:', error));
  };
  //end modal

  const fetchData = (page, searchQuery = "") => {
    axios.get(`http://localhost:3001/api/members?page=${page}&limit=100&search=${searchQuery}`)
      .then(response => {
        const data = response.data;
        const members = data.members.map((member) => ({
          id: member.id,
          memberNumber: (
            <MDTypography display="block" variant="button" fontWeight="medium">
              {member.memberNumber}
            </MDTypography>
          ),
          memberName: (
            <MDTypography display="block" variant="caption">
              {member.memberName ? member.memberName : "N/A"}
            </MDTypography>
          ),
          region: (
            <MDTypography display="block" variant="caption">
              {member.region}
            </MDTypography>
          ),
          carPlate: (
            <MDTypography display="block" variant="caption">
              {member.carPlate}
            </MDTypography>
          ),
          carYear: (
            <MDTypography display="block" variant="caption">
              {member.carYear}
            </MDTypography>
          ),
          phoneNumber: (
            <MDTypography display="block" variant="caption">
              {member.phoneNumber}
            </MDTypography>
          ),
          email: (
            <MDTypography display="block" variant="caption">
              {member.email}
            </MDTypography>
          ),
          status: (
            <MDBox ml={-1}>
              <MDBadge
                badgeContent={member.memberStatus}
                color={member.memberStatus === 'Tidak Aktif' ? 'dark':'success'}
                variant="gradient"
                size="sm"
              />
            </MDBox>
          ),
          joinDate: (
            <MDTypography display="block" variant="caption">
              {new Date(member.joinDate).toLocaleDateString()}
            </MDTypography>
          ),
          renewalDate: (
            <MDTypography display="block" variant="caption">
              {new Date(member.renewalDate).toLocaleDateString()}
            </MDTypography>
          ),
          expiredDate: (
            <MDTypography display="block" variant="caption">
              {new Date(member.expiredDate).toLocaleDateString()}
            </MDTypography>
          ),
          action: (
            <MDBox display="flex" justifyContent="center">
              {isAdmin === 1 && (
                <>
                  <IconButton onClick={() => handleOpenModal(member)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton onClick={() => handleDelete(member.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton onClick={() => handleOpenUpdateStatusModal(member)}>
                    <Icon>update</Icon>
                  </IconButton>
                </>
              )}
              {isAdmin === 2 && (
                <>
                  <IconButton onClick={() => handleOpenModal(member)}>
                    <Icon>edit</Icon>
                  </IconButton>
                  <IconButton onClick={() => handleOpenUpdateStatusModal(member)}>
                    <Icon>update</Icon>
                  </IconButton>
                </>
              )}
            </MDBox>
          ),
        }));
        setRows(members);
        setTotalPages(data.totalPages);
      })
      .catch(error => {
        console.error('Error fetching member data:', error);
      });
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };
  useEffect(() => {
    setColumns([
      { Header: "Member Number", accessor: "memberNumber", align: "left" },
      { Header: "Name", accessor: "memberName", align: "left" },
      { Header: "Region", accessor: "region", align: "left" },
      { Header: "Car Plate", accessor: "carPlate", align: "left" },
      { Header: "Car Year", accessor: "carYear", align: "center" },
      { Header: "Phone Number", accessor: "phoneNumber", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Status", accessor: "status", align: "center" },
      { Header: "Join Date", accessor: "joinDate", align: "center" },
      { Header: "Renewal Date", accessor: "renewalDate", align: "center" },
      { Header: "Expired Date", accessor: "expiredDate", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ]);

    fetchData(page, searchQuery);
  }, [page, searchQuery]);
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(0);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar onSearch={handleSearch} />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
            <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <MDTypography variant="h6" color="white">
                  List Member
                </MDTypography>
                {isAdmin >= 1 && (
                <Button
                  variant="contained"
                  color="white"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenModal()}
                  size="small"
                >
                  Add Member
                </Button>
                )}
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
                {/* Pagination Controls */}
                <MDBox display="flex" justifyContent="center" mt={3}>
                  <button onClick={() => setPage(prev => Math.max(prev - 1, 0))} disabled={page === 0}>
                    Previous
                  </button>
                  <span>{page + 1} of {totalPages}</span>
                  <button onClick={() => setPage(prev => Math.min(prev + 1, totalPages - 1))} disabled={page === totalPages - 1}>
                    Next
                  </button>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      {/* Modal for CRUD operations */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        slotProps={{
          backdrop: {
            onClick: (event) => event.stopPropagation(),
          },
        }}
      >
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6">
              {formData.memberNumber ? "Edit Member" : "Add Member"}
            </MDTypography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            type="hidden"
            name="id"
            value={formData.id}
          />
          <TextField
            name="memberNumber"
            label="Member Number *"
            fullWidth
            margin="normal"
            value={formData.memberNumber}
            onChange={handleFormChange}
            error={formErrors.memberNumber}
            helperText={formErrors.memberNumber && "Member Number is required"}
            required
          />
          <TextField
            name="memberName"
            label="Member Name *"
            fullWidth
            margin="normal"
            value={formData.memberName}
            onChange={handleFormChange}
            error={formErrors.memberName}
            helperText={formErrors.memberName && "Member Name is required"}
            required
          />
          <TextField
            name="region"
            label="Region *"
            fullWidth
            margin="normal"
            value={formData.region}
            onChange={handleFormChange}
            error={formErrors.region}
            helperText={formErrors.region && "Region is required"}
            required
          />
          <TextField
            name="carPlate"
            label="Car Plate Number"
            fullWidth
            margin="normal"
            value={formData.carPlate}
            onChange={handleFormChange}
            error={formErrors.carPlate}
            helperText={formErrors.carPlate && "Car Plate Number is required"}
            required
          />
          <TextField
            name="carYear"
            label="Car Year"
            fullWidth
            margin="normal"
            value={formData.carYear}
            onChange={handleFormChange}
          />
          <TextField
            name="phoneNumber"
            label="Phone Number"
            fullWidth
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleFormChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleFormChange}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleFormChange}
              fullWidth
              variant="outlined"
              size="large"
              sx={{ minHeight: '48px', fontSize: '1rem' }}
            >
              <MenuItem value="active">Aktif</MenuItem>
              <MenuItem value="non-active">Non Aktif</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="joinDate"
            label="Join Date"
            type="date"
            fullWidth
            margin="normal"
            value={formatDate(formData.joinDate)}
            onChange={handleFormChange}
          />
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="white" onClick={handleCloseModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="white" onClick={handleFormSubmit}>
              {formData.memberNumber ? "Save" : "Add"}
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={isUpdateStatusModalOpen}
        onClose={handleCloseUpdateStatusModal}
        aria-labelledby="modal-update-status-title"
        aria-describedby="modal-update-status-description"
        slotProps={{
          backdrop: {
            onClick: (event) => event.stopPropagation(),
          },
        }}
      >
        <Box sx={modalStyle}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <MDTypography variant="h6">Update Status</MDTypography>
            <IconButton onClick={handleCloseUpdateStatusModal}>
              <CloseIcon />
            </IconButton>
          </Box>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={updateStatusData.status}
              onChange={handleUpdateStatusChange}
              variant="outlined"
              size="large"
              sx={{ minHeight: '48px', fontSize: '1rem' }}
            >
              <MenuItem value="active">Renewal KTA</MenuItem>
              <MenuItem value="non-active">Resign</MenuItem>
            </Select>
          </FormControl>
          <TextField
            name="renewDate"
            label="Renewal Date"
            type="date"
            fullWidth
            margin="normal"
            value={updateStatusData.renewalDate}
            onChange={handleUpdateStatusChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Renewal Year</InputLabel>
            <Select
              name="renewalYear"
              value={updateStatusData.renewalYear}
              onChange={handleUpdateStatusChange}
              variant="outlined"
              size="large"
              sx={{ minHeight: '48px', fontSize: '1rem' }}
            >
              <MenuItem value="1">1 Year</MenuItem>
              <MenuItem value="2">2 Year</MenuItem>
              <MenuItem value="3">3 Year</MenuItem>
              <MenuItem value="4">4 Year</MenuItem>
              <MenuItem value="5">5 Year</MenuItem>
            </Select>
          </FormControl>
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="white" onClick={handleCloseUpdateStatusModal} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="white" onClick={handleUpdateStatusSubmit}>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>

    </DashboardLayout>
  );
}

export default Tables;

