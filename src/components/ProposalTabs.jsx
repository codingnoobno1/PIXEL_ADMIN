'use client';

import { useState } from 'react';
import { Tabs, Tab, Box, Typography, Paper } from '@mui/material';

const tabLabels = ['Accepted', 'To Be Reconsidered', 'Not Submitted'];

export default function ProposalTabs() {
  const [currentTab, setCurrentTab] = useState(0);

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <Box p={2}>
            <Typography variant="h6">Accepted Proposals</Typography>
            {/* Replace with map over accepted proposals */}
            <Paper sx={{ p: 2, mt: 2 }}>Project Alpha - Accepted</Paper>
          </Box>
        );
      case 1:
        return (
          <Box p={2}>
            <Typography variant="h6">Proposals to Be Reconsidered</Typography>
            <Paper sx={{ p: 2, mt: 2 }}>Project Beta - Needs Review</Paper>
          </Box>
        );
      case 2:
        return (
          <Box p={2}>
            <Typography variant="h6">Students Who Didn’t Submit</Typography>
            <Paper sx={{ p: 2, mt: 2 }}>Student XYZ - No Submission</Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs value={currentTab} onChange={handleChange} centered>
        {tabLabels.map((label, idx) => (
          <Tab key={idx} label={label} />
        ))}
      </Tabs>
      {renderTabContent()}
    </Box>
  );
}
