using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Acciones.Models
{
    public class Gestiones
    {
        public Gestiones()
        {
            ArchivosGestiones = new HashSet<ArchivosGestiones>();
            BeneficiariosGestion = new HashSet<BeneficiarioGestion>();
            BitacorasGestion = new HashSet<BitacoraGestion>();
            GestionCategoria = new HashSet<GestionCategoria>();
            GestionSubcategoria = new HashSet<GestionSubcategoria>();
        }

        public int GestionId { get; set; }
        public int? LegislaturaId { get; set; }
        public int? DiputadoId { get; set; }
        public int? AsociacionId { get; set; }
        public string Folio { get; set; }

        [DataType(DataType.Date)]
        public DateTime? FechaSolicitud { get; set; }
        [DataType(DataType.Date)]
        public DateTime? FechaCompromiso { get; set; }
        [DataType(DataType.Date)]
        public DateTime? FechaConclusion { get; set; }
        public string Descripcion { get; set; }
        public string Distrito { get; set; }
        public int? OrigenPeticionId { get; set; }
        public int? DependeciaId { get; set; }
        public int? Estatus { get; set; }
        public int? Hito { get; set; }
        public string Campo1 { get; set; }
        public int? Campo2 { get; set; }
        public int? SolicitanteId { get; set; }
        public DateTime? FechaRegistro { get; set; }
        public DateTime? FechaUltimoCambio { get; set; }
        public int? UsuarioRegistro { get; set; }
        public float? Costo { get; set; }
        public int? ResponsableID { get; set; }

        //public virtual Asociacione Asociacion { get; set; }
        //public virtual Dependencia Dependecia { get; set; }
        public virtual Diputado Diputado { get; set; }
        public virtual EstatusGestion EstatusNavigation { get; set; }
        public virtual Legislatura Legislatura { get; set; }
        public virtual OrigenPeticione OrigenPeticion { get; set; }
        public virtual ICollection<ArchivosGestiones> ArchivosGestiones { get; set; }
        public virtual ICollection<BeneficiarioGestion> BeneficiariosGestion { get; set; }
        public virtual ICollection<BitacoraGestion> BitacorasGestion { get; set; }
        public virtual ICollection<GestionCategoria> GestionCategoria { get; set; }
        public virtual ICollection<GestionSubcategoria> GestionSubcategoria { get; set; }
    }
}
