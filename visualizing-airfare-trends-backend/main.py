from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from nbclient import NotebookClient
import nbformat
import os

app = FastAPI()

# Let React talk to the backend (for dev only — tighten this later!)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173/"],  # Set to your React dev server (e.g., "http://localhost:3000") for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/run-notebook")
def run_notebook():
    notebook_path = "dataviz_draft.ipynb"  # make sure it's in the same backend folder
    if not os.path.exists(notebook_path):
        return {"error": "Notebook not found"}

    # Load and run the notebook
    nb = nbformat.read(notebook_path, as_version=4)
    client = NotebookClient(nb)
    client.execute()

    # Extract the number from the last code cell with an output
    for cell in reversed(nb.cells):
        if cell.cell_type == "code" and "outputs" in cell:
            for output in cell["outputs"]:
                if output.output_type == "execute_result" and "text/plain" in output.data:
                    try:
                        val = eval(output.data["text/plain"])  # risky, but okay for now
                        return {"value": val}
                    except:
                        pass
    return {"error": "No numeric output found"}
