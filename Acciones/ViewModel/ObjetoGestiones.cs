using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.ViewModel
{
    public class ObjetoGestiones
    {
        public int GestionId { get; set; }
        public int LegislaturaId { get; set; }
        public string LegislaturaNombre { get; set; }
        public string NumFolio { get; set; }
        public int OrigenGestionId { get; set; }
        public string OrigenGestion { get; set; }
        public string NombreCompleto { get; set; }
        public string Paterno { get; set; }
        public string Materno { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int EstatusId { get; set; }
        public string Estatus { get; set; }
        public string FechaRegistro { get; set; }
        public string FechaSolicitud { get; set; }
        public int diasSolucion { get; set; }
        public int diasTranscurridos { get; set; }
        public float Costo { get; set; }
        public IEnumerable<DetalleCategoriaSubcategoria_G> detalleCategoriaSubcategoria { get; set; }
    }
}
