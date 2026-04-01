def format_data(results):
    return [
        {
            "id": match["id"],
            "score": match["score"],
            "metadata": match["metadata"]
        }
        for match in results["matches"]
    ]