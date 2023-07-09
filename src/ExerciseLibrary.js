import React, { useEffect, useState } from "react";

const ExerciseInfo = () => {
  const [exerciseData, setExerciseData] = useState(null);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const response = await fetch(
          "https://wger.de/api/v2/exercise/1/?language=2",
          {
            headers: {
              Authorization: "Token a3e2b900fe603a5dcb7651ef5f482aa87e01e3e3",
            },
          }
        );
        const data = await response.json();
        setExerciseData(data);
      } catch (error) {
        console.error("Error fetching exercise data:", error);
      }
    };

    fetchExerciseData();
  }, []);

  if (!exerciseData) {
    return <div>Loading exercise data...</div>;
  }

  const { name, description, images } = exerciseData;

  return (
    <div>
      <h2>{name}</h2>
      <p>{description}</p>
      {images && images.length > 0 && (
        <img src={images[0].image} alt="Exercise" />
      )}
    </div>
  );
};

export default ExerciseInfo;
