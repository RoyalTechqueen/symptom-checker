import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import { createAndTrainModel } from "./tf-model";

const SymptomForm: React.FC = () => {
  const [symptomInput, setSymptomInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  useEffect(() => {
    // Load the model when the component mounts
    const loadModel = async () => {
      const trainedModel = await createAndTrainModel();
      setModel(trainedModel);
    };
    loadModel();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!model) {
      setResult("Model is not ready yet. Please wait.");
      return;
    }

    if (!symptomInput.trim()) {
      setResult("Please enter your symptoms.");
      return;
    }

    // Preprocessing the symptom input
    const symptoms = preprocessSymptoms(symptomInput);

    // Convert symptoms to a Tensor
    const inputTensor = tf.tensor2d([symptoms]);

    // Get prediction from the model
    const prediction = model.predict(inputTensor) as tf.Tensor;
    const predictedIndex = prediction.argMax(-1).dataSync()[0];

    // Recommendations
    const recommendations = [
      "Minor Condition: Rest and hydrate.",
      "Minor Condition: Take OTC medication.",
      "Critical: Visit the school clinic.",
    ];

    // Display the result
    setResult(recommendations[predictedIndex]);
  };

  const preprocessSymptoms = (input: string): number[] => {
    /**
     * Example preprocessing logic:
     * Map common symptoms to numeric values for the model.
     */
    const symptomMap: { [key: string]: number } = {
      headache: 1,
      fever: 2,
      cough: 3,
      fatigue: 4,
      drowsiness: 5,
    };

    const words = input.toLowerCase().split(/\s+/);
    const processed = words.map((word) => symptomMap[word] || 0);

    // Ensure input matches model's expected input size (e.g., 3 symptoms)
    return processed.slice(0, 3).concat(Array(3 - processed.length).fill(0));
  };

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold mb-4">Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">
          Enter your symptoms (e.g., headache, drowsiness):
        </label>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows={3}
          placeholder="Type symptoms here..."
          value={symptomInput}
          onChange={(e) => setSymptomInput(e.target.value)}
        ></textarea>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
          Analyze Symptoms
        </button>
      </form>
      {result && <div className="mt-4 p-4 border rounded bg-gray-100">{result}</div>}
    </div>
  );
};

export default SymptomForm;
