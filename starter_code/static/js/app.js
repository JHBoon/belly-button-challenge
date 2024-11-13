// Function to build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    // Use d3 to select the panel with id of `#sample-metadata`
    const sampleMetadata = metadata.find(item => item.id === parseInt(sample));
    let panel = d3.select("#sample-metadata-content");

    // Clear existing metadata
    panel.html("");  

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      panel.append("p").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // Get the samples field
    const samples = data.samples;
    
    // Filter the samples for the object with the desired sample number
    const sampleData = samples.find(item => item.id === sample);

    if (!sampleData) {
      console.error("Sample data not found for sample ID:", sample);
      return;
    }
  
  // Get the otu_ids, otu_labels, and sample_values
    const otuIds = sampleData.otu_ids;
    const otuLabels = sampleData.otu_labels;
    const sampleValues = sampleData.sample_values;

// Build a Bar Chart
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    // Don't forget to slice and reverse the input data appropriately
    const yticks = otuIds.slice(0, 10).reverse().map(id => `OTU ${id}`);
    const barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h"
    };
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" }
    };
    // Render the Bar Chart
    Plotly.newPlot("bar", [barTrace], barLayout);

     // Build a Bubble Chart
    const bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Viridis"
      }
    };
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      hovermode: "closest"
    };
   
    Plotly.newPlot("bubble", [bubbleTrace], bubbleLayout);
  });
}
 // Render the Bubble Chart
 
// Function to run on page load
function init() {
  const selector = d3.select("#selDataset");

// Get the names field
// Use d3 to select the dropdown with id of `#selDataset`
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    const sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Build initial plots and metadata panel with the first sample
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function to handle change in selected sample
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard on page load
init();
