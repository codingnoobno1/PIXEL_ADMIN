
import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  Divider,
  Chip,
} from '@mui/material';

export default function ReviewProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projectfetch');
        const data = await res.json();
        if (data?.projects) {
          setProjects(data.projects);
        }
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSelect = (project) => {
    setSelectedProject(project);
  };

  const handleDecision = (status) => {
    if (!selectedProject) return;

    const updated = projects.map((p) =>
      p.id === selectedProject.id ? { ...p, status } : p
    );
    setProjects(updated);
    setSelectedProject(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress sx={{ color: '#1976D2' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, p: 3 }}>
      {/* Left Panel: List of Projects */}
      <Paper
        elevation={6}
        sx={{ p: 2, width: '40%', maxHeight: '70vh', overflowY: 'auto', bgcolor: 'rgba(25, 118, 210, 0.1)' }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: '#0D47A1' }}>
          Submitted Projects
        </Typography>
        <List>
          {projects.map((project) => (
            <ListItem
              key={project.id}
              divider
              button
              selected={selectedProject?.id === project.id}
              onClick={() => handleSelect(project)}
              sx={{
                bgcolor: project.status === 'accepted'
                  ? '#C8E6C9'
                  : project.status === 'rejected'
                  ? '#FFCDD2'
                  : 'inherit',
              }}
            >
              <ListItemText
                primary={project.title}
                secondary={`Status: ${project.status}`}
                primaryTypographyProps={{ fontWeight: 'bold', color: '#1565C0' }}
                secondaryTypographyProps={{ color: 'text.secondary' }}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Right Panel: Student Group and Action */}
      {selectedProject && (
        <Paper elevation={4} sx={{ p: 3, width: '60%' }}>
          <Typography variant="h6" gutterBottom>
            {selectedProject.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedProject.abstract}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Group Members
          </Typography>

          <List dense>
            {selectedProject.members.map((member, index) => {
              const isApplicant =
                member.enrollment === selectedProject.submittedBy.enrollment;
              return (
                <ListItem key={index}>
                  <Chip
                    label={`${member.name} (${member.enrollment})`}
                    sx={{
                      bgcolor: isApplicant ? '#C8E6C9' : '#FFF9C4',
                      color: '#000',
                      fontWeight: isApplicant ? 'bold' : 'normal',
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleDecision('accepted')}
            >
              Accept
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDecision('rejected')}
            >
              Reject
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
















// import { useEffect, useState } from 'react';
// import {
//   Box,
//   CircularProgress,
//   Paper,
//   List,
//   ListItem,
//   ListItemText,
//   Button,
//   Typography,
//   Divider,
//   Chip,
// } from '@mui/material';

// // Simulated response from project form submission
// const mockSubmittedProjects = [
//   {
//     id: 1,
//     title: 'AI-Based Smart Assistant',
//     abstract: 'An AI voice assistant that learns user habits.',
//     submittedBy: {
//       name: 'John Doe',
//       enrollment: '22IT1001',
//     },
//     members: [
//       { name: 'John Doe', enrollment: '22IT1001' }, // Applied
//       { name: 'Aman Roy', enrollment: '22IT1002' }, // Suggested
//       { name: 'Priya Mehta', enrollment: '22IT1003' }, // Suggested
//     ],
//     status: 'pending',
//   },
//   {
//     id: 2,
//     title: 'Smart Parking System',
//     abstract: 'IoT-based real-time parking monitor.',
//     submittedBy: {
//       name: 'Asha Verma',
//       enrollment: '22IT1004',
//     },
//     members: [
//       { name: 'Asha Verma', enrollment: '22IT1004' }, // Applied
//       { name: 'Simran Gill', enrollment: '22IT1005' }, // Suggested
//     ],
//     status: 'pending',
//   },
// ];

// export default function ReviewProjects() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedProject, setSelectedProject] = useState(null);

//   useEffect(() => {
//     setTimeout(() => {
//       setProjects(mockSubmittedProjects);
//       setLoading(false);
//     }, 1000);
//   }, []);

//   const handleSelect = (project) => {
//     setSelectedProject(project);
//   };

//   const handleDecision = (status) => {
//     if (!selectedProject) return;

//     const updated = projects.map((p) =>
//       p.id === selectedProject.id ? { ...p, status } : p
//     );
//     setProjects(updated);
//     setSelectedProject(null);
//   };

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
//         <CircularProgress sx={{ color: '#1976D2' }} />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ display: 'flex', gap: 4, p: 3 }}>
//       {/* Left Panel: List of Projects */}
//       <Paper
//         elevation={6}
//         sx={{ p: 2, width: '40%', maxHeight: '70vh', overflowY: 'auto', bgcolor: 'rgba(25, 118, 210, 0.1)' }}
//       >
//         <Typography variant="h6" sx={{ mb: 2, color: '#0D47A1' }}>
//           Submitted Projects
//         </Typography>
//         <List>
//           {projects.map((project) => (
//             <ListItem
//               key={project.id}
//               divider
//               button
//               selected={selectedProject?.id === project.id}
//               onClick={() => handleSelect(project)}
//               sx={{
//                 bgcolor: project.status === 'accepted'
//                   ? '#C8E6C9'
//                   : project.status === 'rejected'
//                   ? '#FFCDD2'
//                   : 'inherit',
//               }}
//             >
//               <ListItemText
//                 primary={project.title}
//                 secondary={`Status: ${project.status}`}
//                 primaryTypographyProps={{ fontWeight: 'bold', color: '#1565C0' }}
//                 secondaryTypographyProps={{ color: 'text.secondary' }}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </Paper>

//       {/* Right Panel: Student Group and Action */}
//       {selectedProject && (
//         <Paper elevation={4} sx={{ p: 3, width: '60%' }}>
//           <Typography variant="h6" gutterBottom>
//             {selectedProject.title}
//           </Typography>
//           <Typography variant="body2" sx={{ mb: 2 }}>
//             {selectedProject.abstract}
//           </Typography>

//           <Divider sx={{ my: 2 }} />

//           <Typography variant="subtitle1" sx={{ mb: 1 }}>
//             Group Members
//           </Typography>

//           <List dense>
//             {selectedProject.members.map((member, index) => {
//               const isApplicant =
//                 member.enrollment === selectedProject.submittedBy.enrollment;
//               return (
//                 <ListItem key={index}>
//                   <Chip
//                     label={`${member.name} (${member.enrollment})`}
//                     sx={{
//                       bgcolor: isApplicant ? '#C8E6C9' : '#FFF9C4',
//                       color: '#000',
//                       fontWeight: isApplicant ? 'bold' : 'normal',
//                     }}
//                   />
//                 </ListItem>
//               );
//             })}
//           </List>

//           <Divider sx={{ my: 2 }} />

//           <Box sx={{ display: 'flex', gap: 2 }}>
//             <Button
//               variant="contained"
//               color="success"
//               onClick={() => handleDecision('accepted')}
//             >
//               Accept
//             </Button>
//             <Button
//               variant="outlined"
//               color="error"
//               onClick={() => handleDecision('rejected')}
//             >
//               Reject
//             </Button>
//           </Box>
//         </Paper>
//       )}
//     </Box>
//   );
// }
