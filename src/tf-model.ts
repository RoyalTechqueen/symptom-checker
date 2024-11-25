import * as tf from "@tensorflow/tfjs";

export const createAndTrainModel = async () => {
  const model = tf.sequential();

  // Input layer: Expecting 3 features (symptoms)
  model.add(tf.layers.dense({ units: 10, activation: "relu", inputShape: [3] }));

  // Hidden layer
  model.add(tf.layers.dense({ units: 5, activation: "relu" }));

  // Output layer: 3 categories (2 minor + 1 critical)
  model.add(tf.layers.dense({ units: 3, activation: "softmax" }));

  // Compile the model
  model.compile({
    optimizer: "adam",
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  // Example training data
  const xs = tf.tensor2d([
    [1, 2, 3], // Example: headache, fever, cough
    [4, 0, 5], // Example: fatigue, (none), drowsiness
    [3, 4, 0], // Example: cough, fatigue, (none)
  ]);
  const ys = tf.tensor2d([
    [1, 0, 0], // Recommendation: Rest and hydrate
    [0, 1, 0], // Recommendation: Take OTC medication
    [0, 0, 1], // Recommendation: Visit the school clinic
  ]);

  // Train the model
  await model.fit(xs, ys, { epochs: 10 });

  return model;
};
