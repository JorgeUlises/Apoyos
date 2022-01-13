using Acciones.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoBitacora
    {
        public Bitacora BitacoraBase { get; set; }
        public IEnumerable<ArchivosBitacora> ArchivosRelacionadosBitacora { get; set; }
    }
}
