// Read in the JSON data
d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(data => {
    // Populate the dropdown menu
    var select = d3.select("#selDataset");
    data.names.forEach(name => {
        select.append("option").text(name).property("value", name);
    });

    // Initialize the dashboard with the first individual's data
    var firstId = data.names[0];
    updateBarChart(firstId);
    updateBubbleChart(firstId);
    updateMetadata(firstId);

    // Function to update the bar chart
    function updateBarChart(selectedId) {
        var selectedSample = data.samples.filter(sample => sample.id === selectedId)[0];
        var sampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var otuIds = selectedSample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
        var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();

        var trace = {
            x: sampleValues,
            y: otuIds,
            text: otuLabels,
            type: "bar",
            orientation: "h"
        };

        var layout = {
            title: `Top 10 OTUs Found in Individual ${selectedId}`,
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", [trace], layout);
    }

    // Function to update the bubble chart
    function updateBubbleChart(selectedId) {
        var selectedSample = data.samples.filter(sample => sample.id === selectedId)[0];
        var otuIds = selectedSample.otu_ids;
        var sampleValues = selectedSample.sample_values;
        var otuLabels = selectedSample.otu_labels;

        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth' // You can choose other color scales
            }
        };

        var layout = {
            title: `Sample Values for Individual ${selectedId}`,
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Sample Values' },
            showlegend: false
        };

        Plotly.newPlot('bubble', [trace], layout);
    }

    // Function to update the metadata section
    function updateMetadata(selectedId) {
        var selectedMetadata = data.metadata.filter(metadata => metadata.id == selectedId)[0];
        var metadataContainer = d3.select("#sample-metadata");

        // Clear any existing metadata
        metadataContainer.html("");

        // Add each key-value pair to the metadata container
        Object.entries(selectedMetadata).forEach(([key, value]) => {
            metadataContainer.append("p").text(`${key}: ${value}`);
        });
    }

    // Event listener for the dropdown menu
    dropdownMenu.on("change", function() {
        var selectedId = d3.select(this).property("value");
        updateBarChart(selectedId);
        updateBubbleChart(selectedId);
        updateMetadata(selectedId);
    });
});