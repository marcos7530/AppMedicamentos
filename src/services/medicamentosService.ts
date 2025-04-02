import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

const DATOS_GOV_URL = 'https://datos.gob.ar/dataset/pami-listado-precios-medicamentos-para-entidades/archivo/pami_e72a9026-a971-46c1-b828-2638b2b2be37';

export const medicamentosService = {
  async descargarArchivoXLSX() {
    try {
      // Crear directorio si no existe
      const dirUri = `${FileSystem.documentDirectory}medicamentos`;
      const dirInfo = await FileSystem.getInfoAsync(dirUri);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dirUri);
      }

      const fileUri = `${dirUri}/medicamentos.xlsx`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      // Obtener la fecha de última modificación del archivo remoto
      const response = await fetch(DATOS_GOV_URL);
      const lastModified = response.headers.get('last-modified');
      const remoteDate = lastModified ? new Date(lastModified) : null;

      // Si el archivo existe, obtener su fecha de modificación
      let localDate = null;
      if (fileInfo.exists) {
        const fileStats = await FileSystem.getInfoAsync(fileUri);
        if (fileStats.exists && 'modificationTime' in fileStats) {
          localDate = new Date(fileStats.modificationTime * 1000);
        }
      }

      // Si no hay archivo local o el remoto es más reciente, descargar
      if (!fileInfo.exists || (remoteDate && (!localDate || remoteDate > localDate))) {
        await FileSystem.downloadAsync(DATOS_GOV_URL, fileUri);
        return {
          uri: fileUri,
          isNewVersion: true,
          lastUpdate: remoteDate
        };
      }

      return {
        uri: fileUri,
        isNewVersion: false,
        lastUpdate: localDate
      };
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
      throw error;
    }
  },

  async leerArchivoXLSX() {
    try {
      const fileUri = `${FileSystem.documentDirectory}medicamentos/medicamentos.xlsx`;
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64
      });

      const workbook = XLSX.read(fileContent, { type: 'base64' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      return data;
    } catch (error) {
      console.error('Error al leer el archivo:', error);
      throw error;
    }
  },

  async verificarActualizacion() {
    try {
      const { isNewVersion, lastUpdate } = await this.descargarArchivoXLSX();
      return {
        isNewVersion,
        lastUpdate,
        message: isNewVersion 
          ? 'Se ha descargado una nueva versión del listado de medicamentos.'
          : `El listado de medicamentos está actualizado (última actualización: ${lastUpdate?.toLocaleDateString()})`
      };
    } catch (error) {
      console.error('Error al verificar actualización:', error);
      throw error;
    }
  }
}; 