function generateTree() {
    const text = document.getElementById('input-text').value;
    if (!text) {
      alert("Empty");
      return;
    }
  
    const freq = {};
    for (let char of text) {
      freq[char] = (freq[char] || 0) + 1;
    }
  
    const nodes = Object.entries(freq).map(([char, freq]) => ({ name: char, value: freq }));
  
    while (nodes.length > 1) {
      nodes.sort((a, b) => a.value - b.value);
      const left = nodes.shift();
      const right = nodes.shift();
  
      nodes.push({
        name: `${left.name}${right.name}`,
        value: left.value + right.value,
        children: [left, right]
      });
    }
  
    const treeData = nodes[0];
  
    drawTree(treeData);
  }
  
  function drawTree(treeData) {
    document.getElementById("tree-area").innerHTML = ""; //clc
  
    const margin = { top: 20, right: 90, bottom: 30, left: 90 },
          width = 1200 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;
  
    const svg = d3.select("#tree-area").append("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    const treemap = d3.tree().size([height, width]);
    let i = 0;
  
    const root = d3.hierarchy(treeData);
    root.x0 = height / 2;
    root.y0 = 0;
  
    const treeLayout = treemap(root);
    const nodes = treeLayout.descendants();
    const links = treeLayout.links();
  
    nodes.forEach(function(d){ d.y = d.depth * 180 });
  
    // Nodur i
    const node = svg.selectAll('g.node')
        .data(nodes)
        .enter().append('g')
        .attr('class', 'node')
        .attr("transform", d => "translate(" + d.y + "," + d.x + ")");
  
    node.append('circle')
        .attr('class', 'node')
        .attr('r', 10)
        .style("fill", "#fff")
        .style("stroke", "steelblue")
        .style("stroke-width", "3px");
  
    node.append('text')
        .attr("dy", ".35em")
        .attr("x", d => d.children ? -13 : 13)
        .style("text-anchor", d => d.children ? "end" : "start")
        .text(d => {
            const isLeaf = !d.children && !d._children;
            return isLeaf ? `${d.data.name} = ${d.data.value}` : d.data.value;
          });
  
    // Linkuri
    svg.selectAll('path.link')
        .data(links)
        .enter().append('path')
        .attr("class", "link")
        .attr("fill", "none")
        .attr("stroke", "#ccc")
        .attr("stroke-width", 2)
        .attr("d", d => `
          M${d.source.y},${d.source.x}
          C${(d.source.y + d.target.y) / 2},${d.source.x}
           ${(d.source.y + d.target.y) / 2},${d.target.x}
           ${d.target.y},${d.target.x}
        `);
  }
  