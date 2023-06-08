
export type MatrixHouseResponse = {
    pkMatrixHouse: string,
    codeMatrixHouse: string,
    nameHouse: string,
    descriptionMatrixHouse: string,
    categoryMatrixHouse: string,
    provinceMatrixHouse: string,
    deletedHouse: boolean,
}

export type MatrixHouseCreateRequest = Omit<MatrixHouseResponse, 'pkMatrixHouse' | 'deletedHouse'>

export type MatrixHouseUpdateRequest = Partial<MatrixHouseCreateRequest>

export type MatrixHouseShort = { pkMatrixHouse: string, nameHouse: string, codeMatrixHouse: string, descriptionMatrixHouse: string }