using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class Iniciativas
    {
        public int IniciativaId { get; set; }
        public int? LegislaturaId { get; set; }
        public int? CatTipoIniciativaId { get; set; }
        public int? PresidenteId { get; set; }
        public int? PromotorId { get; set; }
        public string NumTurno { get; set; }
        public int? NumeroSecuencial { get; set; }
        public string Titulo { get; set; }
        public string Clasificacion { get; set; }
        public int? EstatusIniciativaId { get; set; }
        public string DocumentoReferencia { get; set; }
        public string LinkReferencia { get; set; }
        public DateTime? FechaRecibido { get; set; }
        public DateTime? FechaTurno { get; set; }
        public DateTime? FechaAprobacionComision { get; set; }
        public DateTime? FechaAprobabcionPleno { get; set; }
        public DateTime? FechaPublicacionSa { get; set; }
        public DateTime? FechaBaja { get; set; }
        public int? PresentadorIntExt { get; set; }
        public int? NumeroPresentadoresInt { get; set; }
        public int? NumeroPresentadoresExt { get; set; }
        public string Notas { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
    }
}
