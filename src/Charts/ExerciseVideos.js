import React from "react";
import { Typography, Box, Stack } from "@mui/material";

function ExcerciseVideos({ exerciseVideos, name }) {
  if (!exerciseVideos.length) return "Loading...";

  return (
    <Box sx={{ mt: { lg: "200px", xs: "20px" } }} p="20px">
      <Typography variant="h4" mb="30px">
        Watch{" "}
        <span
          style={{
            color: "#c865d4",
          }}
        >
          {name}
        </span>{" "}
        video(s)
      </Typography>
      <Stack
        justifyContent="flex-start"
        flexWrap="wrap"
        alignItems="center"
        sx={{ flexDirection: { lg: "row" }, gap: { lg: "110px", xs: "0" } }}
      >
        {exerciseVideos?.slice(0, 3)?.map((item, index) => (
          <a
            key={index}
            className="exercise-video"
            href={`https://www.youtube.com/watch?v=${item.video.videoId}`}
            target="_blank"
            rel="noreferrer"
          >
            <img src={item.video.thumbnails[0].url} alt={item.video.title} />
            <Box>
              <Typography variant="h5" color="black">
                {item.video.title}
              </Typography>
              <Typography variant="h7" color="black">
                {item.video.channelName}
              </Typography>
            </Box>
          </a>
        ))}
      </Stack>
    </Box>
  );
}

export default ExcerciseVideos;
