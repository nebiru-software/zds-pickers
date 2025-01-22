declare module 'zds-mappings' {
  function cloneMapping(mappingName: string): Mapping
  function createUserMapping(mappingName: string): Mapping
  function editUserMapping(
    mappingName: string,
    noteNum: number,
    field: string,
    value: string | number,
  ): Mapping

  function getMapping(mappingName: string): Mapping

  function emptyMapping(): Mapping

  function getNextAvailableMappingName(path: string): string
  function reverse(mapping: Mapping): string
  function storeMapping(mappingName: string, rawContent: string): void
  function validateContent(content: string): boolean

  function getAvailableGroups(): { label: string; value: string }[]
  function getStockNames(): string[]
  function getUserMappingNames(): string[]
  function removeMapping(mappingName: string): void
  function renameUserMapping(
    oldKey: string,
    newKey: string,
  ): { [key: string]: string | number }

  interface MapItem {
    note: number
    group: string
    name: string
  }

  type Mapping = MapItem[]

  export {
    cloneMapping,
    createUserMapping,
    emptyMapping,
    editUserMapping,
    getAvailableGroups,
    getMapping,
    getNextAvailableMappingName,
    getStockNames,
    getUserMappingNames,
    removeMapping,
    renameUserMapping,
    reverse,
    storeMapping,
    validateContent,
  }

  export type { MapItem, Mapping }
}
