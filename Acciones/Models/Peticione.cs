using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

#nullable disable

namespace Acciones.Models
{
    public partial class Peticione
    {
        public Peticione()
        {
            ArchivosPeticiones = new HashSet<ArchivosPeticione>();
            Beneficiarios = new HashSet<Beneficiario>();
            Bitacoras = new HashSet<Bitacora>();
            PeticionCategoria = new HashSet<PeticionCategorium>();
            PeticionSubcategoria = new HashSet<PeticionSubcategorium>();
        }

        public int PeticionId { get; set; }
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

        public virtual Asociacione Asociacion { get; set; }
        public virtual Dependencia Dependecia { get; set; }
        public virtual Diputado Diputado { get; set; }
        public virtual EstatusPeticione EstatusNavigation { get; set; }
        public virtual Legislatura Legislatura { get; set; }
        public virtual OrigenPeticione OrigenPeticion { get; set; }
        public virtual ICollection<ArchivosPeticione> ArchivosPeticiones { get; set; }
        public virtual ICollection<Beneficiario> Beneficiarios { get; set; }
        public virtual ICollection<Bitacora> Bitacoras { get; set; }
        public virtual ICollection<PeticionCategorium> PeticionCategoria { get; set; }
        public virtual ICollection<PeticionSubcategorium> PeticionSubcategoria { get; set; }
    }
}
