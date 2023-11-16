import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import {
  exerciseOptions,
  fetchData,
  youtubeOptions,
} from "../../utils/fetchData";
import Information from "./Information";
import ExerciseVideos from "./ExerciseVideos";
import SimilarExercises from "./SimilarExercises";
import ResponsiveAppBar from "../Layout/ResponsiveAppBar";

function ExerciseInformation() {
  const [exerciseInformation, setExerciseInformation] = useState({});
  const [exerciseVideos, setExerciseVideos] = useState([]);
  const [targetMuscleExercises, setTargetMuscleExercises] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchExerciseData = async () => {
      const exerciseDbUrl = "https://exercisedb.p.rapidapi.com";
      const youtubeSearchUrl =
        "https://youtube-search-and-download.p.rapidapi.com";

      const exerciseInformationData = await fetchData(
        `${exerciseDbUrl}/exercises/exercise/${id}`,
        exerciseOptions
      );
      setExerciseInformation(exerciseInformationData);

      const exerciseVideosData = await fetchData(
        `${youtubeSearchUrl}/search?query=${exerciseInformationData.name}`,
        youtubeOptions
      );
      setExerciseVideos(exerciseVideosData.contents);

      const targetMuscleExercisesData = await fetchData(
        `${exerciseDbUrl}/exercises/target/${exerciseInformationData.target}`,
        exerciseOptions
      );
      setTargetMuscleExercises(targetMuscleExercisesData);
    };

    fetchExerciseData();
  }, [id]);

  return (
    <Box>
      <ResponsiveAppBar />
      <Information exerciseInformation={exerciseInformation} />
      <ExerciseVideos
        exerciseVideos={exerciseVideos}
        name={exerciseInformation.name}
      />
      <SimilarExercises targetMuscleExercises={targetMuscleExercises} />
    </Box>
  );
}

export default ExerciseInformation;
