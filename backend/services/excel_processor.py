import pandas as pd
from langchain_core.documents import Document


def clean_dataframe(df):

    # Remove empty rows
    df = df.dropna(how="all")

    # Remove empty columns
    df = df.dropna(axis=1, how="all")

    # Remove duplicate rows
    df = df.drop_duplicates()

    # Clean column names
    df.columns = df.columns.astype(str).str.strip()

    # Clean text values
    for column in df.select_dtypes(include="object").columns:
        df[column] = df[column].str.strip()

    # Fill missing values
    df = df.fillna("Unknown")

    return df


def process_excel(file_path):

    df = pd.read_excel(file_path)

    return clean_dataframe(df)


def process_csv(file_path):

    df = pd.read_csv(file_path)

    return clean_dataframe(df)


def dataframe_to_documents(df):

    documents = []

    for index, row in df.iterrows():

        text = ""

        for column in df.columns:
            text += f"{column}: {row[column]}\n"

        document = Document(
            page_content=text,
            metadata={
                "source": "spreadsheet",
                "row": index + 1
            }
        )

        documents.append(document)

    return documents