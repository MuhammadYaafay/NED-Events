import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Collapse, Avatar, IconButton, Typography, Button
} from '@mui/material';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StarIcon from '@mui/icons-material/Star';

const ExpandMoreButton = styled(IconButton)(({ theme, expanded }) => ({
  marginLeft: 'auto',
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function EventCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => setExpanded(!expanded);

  return (
    <Card sx={{ width: 300, boxShadow: 3, borderRadius: 2, margin: 'auto' }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="user">
            {data.username[0].toUpperCase()}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            {data.username}
            <StarIcon sx={{ fontSize: 16, color: 'gold' }} />
            <Typography variant="body2" fontWeight="bold">
              {data.review.toFixed(1)}
            </Typography>
          </div>
        }
        subheader={data.date}
      />

      <CardMedia
        component="img"
        height="180"
        image={data.img}
        alt="Event"
        sx={{ objectFit: 'cover', borderRadius: 1 }}
      />

      <CardContent sx={{ paddingBottom: expanded ? 1 : 2 }}>
        <Typography variant="body1" color="text.primary" fontWeight={500} noWrap>
          {data.intro}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton aria-label="like">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMoreButton
          onClick={handleExpandClick}
          expanded={expanded ? 1 : 0}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMoreButton>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ maxHeight: 150, overflow: 'auto' }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {data.desp}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            View Details
          </Button>
        </CardContent>
      </Collapse>
    </Card>
  );
}
