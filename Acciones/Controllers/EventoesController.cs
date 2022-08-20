using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Acciones.Models;
using Acciones.ViewModel;
using Microsoft.Data.SqlClient;

using System.Data;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Security.Claims;

namespace Acciones.Controllers
{
    public class EventoesController : Controller
    {
        private readonly dbAccionesContext _context;

        public EventoesController(dbAccionesContext context)
        {
            _context = context;
        }

        // GET: Eventoes
        public async Task<IActionResult> Index()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }
            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegBusqueda"] = LLegis;

            List<SelectListItem> LstTiposEvento = new SelectList(_context.TiposEvento, "TipoEventoId", "Nombre").ToList();
            LstTiposEvento.Insert(0, new SelectListItem() { Value = "0", Text = "SIN TIPO" });
            LstTiposEvento.Insert(0, new SelectListItem() { Value = "-1", Text = "TODO" });
            ViewData["TiposEvento"] = LstTiposEvento;

            var dbAccionesContext = _context.Eventos;
            ViewBag.JavaScriptFunction = string.Format("FiltraEventos();");
            return View(await dbAccionesContext.ToListAsync());
        }

        // GET: Eventoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var evento = await _context.Eventos
                .Include(e => e.Calle)
                .Include(e => e.Colonia)
                .Include(e => e.Diputado)
                .Include(e => e.Legislatura)
                .FirstOrDefaultAsync(m => m.EventoId == id);
            if (evento == null)
            {
                return NotFound();
            }

            return View(evento);
        }

        // GET: Eventoes/Create
        public IActionResult Create()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle");
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia");
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId");
            //ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre");

            List<SelectListItem> LstTiposEvento = new SelectList(_context.TiposEvento, "TipoEventoId", "Nombre").ToList();
            LstTiposEvento.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TiposEvento"] = LstTiposEvento;

            var LegId = _context.Legislaturas.Where(l => l.Estatus == 1).Select(l => l.LegislaturaId).SingleOrDefault();
            List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            var selected = LLegis.Where(x => x.Value == LegId.ToString()).First();
            selected.Selected = true;
            ViewData["LegEventoNvoReg"] = LLegis;

            return View();
        }

        // POST: Eventoes/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("EventoId,LegislaturaId,DiputadoId,Fecha,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,NumAsistentes,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Evento evento)
        {
            if (ModelState.IsValid)
            {
                _context.Add(evento);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);

            List<SelectListItem> LstTiposEvento = new SelectList(_context.TiposEvento, "TipoEventoId", "Nombre").ToList();
            LstTiposEvento.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TiposEvento"] = LstTiposEvento;

            return View(evento);
        }

        // GET: Eventoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var evento = await _context.Eventos.FindAsync(id);
            if (evento == null)
            {
                return NotFound();
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);

            ViewData["ColoniaVD"] = _context.Colonias.Where(c => c.ColoniaId == evento.ColoniaId).Select(c => c.NombreColonia).FirstOrDefault();
            ViewData["CalleVD"] = _context.Calles.Where(c => c.ColoniaId == evento.ColoniaId).Select(c => c.NombreCalle).FirstOrDefault();

            List<SelectListItem> LstTiposEvento = new SelectList(_context.TiposEvento, "TipoEventoId", "Nombre").ToList();
            LstTiposEvento.Insert(0, new SelectListItem() { Value = "0", Text = "" });
            ViewData["TiposEvento"] = LstTiposEvento;

            //List<SelectListItem> LLegis = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre").ToList();
            //var selected = LLegis.Where(x => x.Value == evento.LegislaturaId.ToString()).First();
            //selected.Selected = true;
            //ViewData["LegislaturaId"] = LLegis;

            ViewBag.JavaScriptFunction = string.Format("mostrarComplementoEvento(" + id + ");");

            return View(evento);
        }

        // POST: Eventoes/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("EventoId,LegislaturaId,DiputadoId,Fecha,Descripcion,ColoniaId,CalleId,NumExterior,NumInterior,Cp,Distrito,Seccion,NumAsistentes,Estatus,Campo1,Campo2,Latitud,Longitud,FechaRegistro,FechaUltimoCambio,UsuarioRegistro")] Evento evento)
        {
            if (id != evento.EventoId)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(evento);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!EventoExists(evento.EventoId))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["CalleId"] = new SelectList(_context.Calles, "CalleId", "NombreCalle", evento.CalleId);
            ViewData["ColoniaId"] = new SelectList(_context.Colonias, "ColoniaId", "NombreColonia", evento.ColoniaId);
            ViewData["DiputadoId"] = new SelectList(_context.Diputados, "DiputadoId", "DiputadoId", evento.DiputadoId);
            ViewData["LegislaturaId"] = new SelectList(_context.Legislaturas, "LegislaturaId", "Nombre", evento.LegislaturaId);


            return View(evento);
        }

        // GET: Eventoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            var evento = await _context.Eventos
                .Include(e => e.Calle)
                .Include(e => e.Colonia)
                .Include(e => e.Diputado)
                .Include(e => e.Legislatura)
                .FirstOrDefaultAsync(m => m.EventoId == id);
            if (evento == null)
            {
                return NotFound();
            }

            return View(evento);
        }

        // POST: Eventoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Redirect("/Apoyo/Home/Inicio");
            }

            BORRA_EVENTO(id);
            
            var evento = await _context.Eventos.FindAsync(id);
            _context.Eventos.Remove(evento);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool EventoExists(int id)
        {
            return _context.Eventos.Any(e => e.EventoId == id);
        }


        /****************************************************************************
             BORRA PETICIÓN
                 1. ARCHIVOS
                 2. ASISTENTES
         *****************************************************************************/
        public int BORRA_EVENTO(int idEvento)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpDELETE_Evento";
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        /************************************************************
                    BORRAR Archivo de Eventos
        *************************************************************/
        [HttpPost]
        public int BorrarArchivoEvento(int archivoId)
        {
            var valReturn = 0;
            try
            {
                var archivoEventoObj = _context.ArchivosEventos.Find(archivoId);
                _context.ArchivosEventos.Remove(archivoEventoObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }

        /************************************************************
                    BORRAR Asistente al Evento
        *************************************************************/
        [HttpPost]
        public int BorrarAsistenteEvento(int asistenteEventoID)
        {
            var valReturn = 0;
            try
            {
                var asistenteObj = _context.AsistentesEventos.Find(asistenteEventoID);
                _context.AsistentesEventos.Remove(asistenteObj);
                _context.SaveChanges();

                valReturn = 1;
            }
            catch
            {
                valReturn = 0;
            }

            return valReturn;
        }


        /************************************************************
            Obtiene Todas los EVENTOS
        *************************************************************/
        public IEnumerable<ObjetoEventos> ObtieneEventos(int RegXpag, int offsetPeticiones, int LegislaturaID, string folio, string descripcion, int tipoId, int estatusId, string fechaInicioEvento, string fechaFinEvento, string colonia)
        {
            int diputadoId = 8;
            IEnumerable<ObjetoEventos> ListaObjetos = new List<ObjetoEventos>();
            ListaObjetos = (IEnumerable<ObjetoEventos>)(
                    from eventos in _context.Eventos.Where(eve => eve.LegislaturaId == LegislaturaID && eve.DiputadoId == diputadoId)
                    join colonias in _context.Colonias on eventos.ColoniaId equals colonias.ColoniaId
                    join calles in _context.Calles on eventos.CalleId equals calles.CalleId
                    join legislatura in _context.Legislaturas on eventos.LegislaturaId equals legislatura.LegislaturaId
                    //join tipoEvento in _context.TiposEvento on eventos.TipoEventoId equals tipoEvento.TipoEventoId

                    //where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                    where true && String.IsNullOrEmpty(descripcion) ? (true) : eventos.Descripcion.Contains(descripcion)
                    where true && String.IsNullOrEmpty(colonia) ? (true) : colonias.NombreColonia.Contains(colonia)
                    where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                    where true && (tipoId < 0) ? (true) : (int)eventos.TipoEventoId == tipoId
                    where true && (estatusId < 0) ? (true) : eventos.Estatus == estatusId
                    where true && (fechaInicioEvento == "0" && fechaFinEvento == "0") ? (true) : _context.Eventos.Where(e => e.Fecha >= DateTime.ParseExact(fechaInicioEvento, "dd-MM-yyyy HH:mm", null) && e.Fecha <= DateTime.ParseExact(fechaFinEvento, "dd-MM-yyyy HH:mm", null)).Select(e => e.EventoId).Contains(eventos.EventoId)

                    //orderby Convert.ToInt32(peticiones.Folio) descending
                    orderby eventos.Fecha descending

                    select new ObjetoEventos
                    {
                        EventoId = eventos.EventoId,
                        LegislaturaId = (int)eventos.LegislaturaId,
                        LegislaturaNombre = legislatura.Nombre,
                        NumFolio = eventos.Folio??"",
                        Descripcion = eventos.Descripcion,
                        //Tipo = eventos.Tipo,
                        Tipo = _context.TiposEvento.Where(te => te.TipoEventoId == eventos.TipoEventoId).Select(te=>te.Nombre).FirstOrDefault()??"", 
                        NumeroAsistentes = (int)eventos.NumAsistentes,
                        Colonia = colonias.NombreColonia,
                        Calle = calles.NombreCalle,
                        NumeroExterior = eventos.NumExterior,
                        NumeroInterior = eventos.NumInterior,
                        Latitud = eventos.Latitud,
                        Longitud = eventos.Longitud,
                        CP = (int)eventos.Cp,
                        EstatusId = (int)eventos.Estatus,
                        Fecha = eventos.Fecha != null ? ((DateTime)eventos.Fecha).ToShortDateString() : "",

                    }).Skip(offsetPeticiones).Take(RegXpag);
            return ListaObjetos;
        }

        /************************************************************
            Obtiene Número de Registros aplicando FILTRO
        *************************************************************/
        public int ObtieneNumeroEventosXfiltro(int LegislaturaID, string folio, string descripcion, int tipoId, int estatusId, string fechaInicioEvento, string fechaFinEvento, string colonia)
        {
            int diputadoId = 8;
            var results =
                        from eventos in _context.Eventos.Where(eve => eve.LegislaturaId == LegislaturaID && eve.DiputadoId == diputadoId)
                        join colonias in _context.Colonias on eventos.ColoniaId equals colonias.ColoniaId
                        join calles in _context.Calles on eventos.CalleId equals calles.CalleId
                        join legislatura in _context.Legislaturas on eventos.LegislaturaId equals legislatura.LegislaturaId
                        //join tipoEvento in _context.TiposEvento on eventos.TipoEventoId equals tipoEvento.TipoEventoId

                        //where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                        where true && String.IsNullOrEmpty(descripcion) ? (true) : eventos.Descripcion.Contains(descripcion)
                        where true && String.IsNullOrEmpty(colonia) ? (true) : colonias.NombreColonia.Contains(colonia)
                        where true && String.IsNullOrEmpty(folio) ? (true) : eventos.Folio.Contains(folio)
                        where true && (tipoId < 0) ? (true) : (int)eventos.TipoEventoId == tipoId
                        where true && (estatusId < 0) ? (true) : eventos.Estatus == estatusId
                        where true && (fechaInicioEvento == "0" && fechaFinEvento == "0") ? (true) : _context.Eventos.Where(e => e.Fecha >= DateTime.ParseExact(fechaInicioEvento, "dd-MM-yyyy HH:mm", null) && e.Fecha <= DateTime.ParseExact(fechaFinEvento, "dd-MM-yyyy HH:mm", null)).Select(e => e.EventoId).Contains(eventos.EventoId)

                        //orderby Convert.ToInt32(peticiones.Folio) descending

                        select eventos.EventoId;

            return results.Count();
        }

        /*******************************************************************
            Obtiene el número de Eventos
        ********************************************************************/
        public Int32 numeroEventos(int LegislaturaID)
        {
            int diputadoId = 8;
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[Eventos] WHERE LegislaturaID = " + LegislaturaID + " AND DiputadoID = " + diputadoId;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }


        /************************************************************
            Obtiene un EVENTO identificado por un Id
        *************************************************************/
        public IEnumerable<ObjetoEvento> ObtieneDetalleEvento(int idEvento)
        {
            IEnumerable<ObjetoEvento> ListaObjetos = new List<ObjetoEvento>();
            ListaObjetos = (IEnumerable<ObjetoEvento>)(
                    from eventos in _context.Eventos.Where(eve => eve.EventoId == idEvento)
                    join legislatura in _context.Legislaturas on eventos.LegislaturaId equals legislatura.LegislaturaId
                    join colonia in _context.Colonias on eventos.ColoniaId equals colonia.ColoniaId
                    join calle in _context.Calles on eventos.CalleId equals calle.CalleId
                    select new ObjetoEvento
                    {
                        EventoId = eventos.EventoId,
                        LegislaturaId = eventos.LegislaturaId,
                        NombreLegislatura = legislatura.Nombre,
                        Folio = eventos.Folio,
                        EstatusId = eventos.Estatus,
                        NumAsistentes = eventos.NumAsistentes,
                        FechaEvento = eventos.Fecha,
                        Tipo = _context.TiposEvento.Where(te => te.TipoEventoId == eventos.TipoEventoId).Select(te => te.Nombre).FirstOrDefault(),
                        ColoniaId = eventos.ColoniaId,
                        Colonia = colonia.NombreColonia,
                        CalleId = eventos.CalleId,
                        Calle = calle.NombreCalle,
                        NumExterior = eventos.NumExterior,
                        NumInterior = eventos.NumInterior,
                        CP = eventos.Cp,
                        Latitud = eventos.Latitud,
                        Longitud = eventos.Longitud,
                        NombreEvento = eventos.Descripcion,
                        HoraInicio = eventos.HoraInicio.ToString(@"hh\:mm"),
                        Lugar = eventos.Lugar??""
                    });
            return ListaObjetos;
        }

        /************************************************************
            Nuevo Evento
        *************************************************************/
        [HttpPost]
        public int NuevoEvento(int legislaturaId, string folioEvento, int estatusId, int numAsistentes, string fechaEvento, int tipoEvento, int coloniaId, int calleId, string numExt, string numInt, int CP, string latitud, string longitud, string descripcionEvento, string horaInicioEvento, string lugar)
        {
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);
            Evento evento = new Evento
            {
                LegislaturaId = legislaturaId,
                Folio = folioEvento ?? "",
                Estatus = estatusId,
                NumAsistentes = numAsistentes,
                Fecha = fechaEvento == null || fechaEvento == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaEvento + " 00:00:00"),
                Tipo = "",
                TipoEventoId = (int)tipoEvento,
                ColoniaId = coloniaId,
                CalleId = calleId,
                NumExterior = numExt ?? "",
                NumInterior = numInt ?? "",
                Cp = CP,
                Latitud = latitud ?? "",
                Longitud = longitud ?? "",
                Descripcion = descripcionEvento,
                Campo1 = "",
                Campo2 = 0,

                DiputadoId = 8,
                Distrito = "V",
                Seccion = "",
                FechaRegistro = DateTime.Now,
                FechaUltimoCambio = DateTime.Now,
                UsuarioRegistro = idUsr,
                HoraInicio = TimeSpan.Parse(horaInicioEvento),
                Lugar = lugar ?? ""
            };


            try
            {
                _context.Add(evento);
                _context.SaveChanges();

                if (evento.EventoId != 0)
                {
                    return evento.EventoId;
                }
                else
                {
                    Console.WriteLine("No se insertó en la BD el Evento");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar el Evento: {0}", e.Message);
                return -2;
            }
        }

        /************************************************************
            ACTUALIZA Evento
        *************************************************************/
        [HttpPost]
        public int ActualizaEvento(int eventoId,int legislaturaId, string folioEvento, int estatusId, int numAsistentes, string fechaEvento, int tipoEvento, int coloniaId, int calleId, string numExt, string numInt, int CP, string latitud, string longitud, string descripcionEvento, DateTime FechaRegistro, string horaInicioEvento, string lugar)
        {
            string idU = this.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var idUsr = Int32.Parse(idU);

            Evento evento = new Evento
            {
                EventoId = eventoId,
                LegislaturaId = legislaturaId,
                Folio = folioEvento,
                Estatus = estatusId,
                NumAsistentes = numAsistentes,
                Fecha = fechaEvento == null || fechaEvento == "" ? new DateTime(1900, 1, 1) : Convert.ToDateTime(fechaEvento + " 00:00:00"),
                TipoEventoId = tipoEvento,
                ColoniaId = coloniaId,
                CalleId = calleId,
                NumExterior = numExt ?? "",
                NumInterior = numInt ?? "",
                Cp = CP,
                Latitud = latitud ?? "",
                Longitud = longitud ?? "",
                Descripcion = descripcionEvento,
                Campo1 = "",
                Campo2 = 0,

                DiputadoId = 8,
                Distrito = "V",
                Seccion = "",
                FechaRegistro = FechaRegistro,
                FechaUltimoCambio = DateTime.Now,
                UsuarioRegistro = idUsr,

                HoraInicio = TimeSpan.Parse(horaInicioEvento),
                Lugar = lugar,
            };

            try
            {
                _context.Update(evento);
                _context.SaveChanges();

                if (evento.EventoId != 0)
                {
                    return evento.EventoId;
                }
                else
                {
                    Console.WriteLine("No se actualizó en la BD el Evento");
                    return -1;
                }
            }
            catch (Exception e)
            {
                Console.WriteLine("Error al Insertar el Evento: {0}", e.Message);
                return -2;
            }
        }

        /*******************************************************************
            Obtiene Resumen de Eventos X Tipo X Estatus
        ********************************************************************/
        [HttpGet]
        public List<ObjetoEventoTipoEstatus> resumenXtipo(int LegislaturaId, int anioSel, int mesSel)
        {
            List<ObjetoEventoTipoEstatus> ListaObjetos = new List<ObjetoEventoTipoEstatus>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpResumenEventosXtipoXestatus";
            cmd.Parameters.Add("@LegislaturaId", System.Data.SqlDbType.Int).Value = LegislaturaId;
            cmd.Parameters.Add("@Anio", System.Data.SqlDbType.Int).Value = anioSel;
            cmd.Parameters.Add("@Mes", System.Data.SqlDbType.Int).Value = mesSel;

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoEventoTipoEstatus obj = new ObjetoEventoTipoEstatus();
                    obj.Tipo = query.GetString(0);
                    obj.SinEstatus = query.GetInt32(1);
                    obj.Planeado = query.GetInt32(2);
                    obj.Realizado = query.GetInt32(3);
                    obj.Pospuesto = query.GetInt32(4);
                    obj.Cancelado = query.GetInt32(5);
                    obj.Total = query.GetInt32(1) + query.GetInt32(2) + query.GetInt32(3) + query.GetInt32(4) + query.GetInt32(5);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }

        /************************************************************
            Busca si existe un Número de Folio
        *************************************************************/
        public int BuscaNumeroFolio(string folio)
        {
            var TotalRegistrosEncontrados = _context.Eventos.Where(p => p.Folio == folio).Count();
            return TotalRegistrosEncontrados;
        }



        /****************************************************************************
            Obtiene Lista de Asistentes a un Evento
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoAsistente> ObtieneListaAsistentesEvento(int idEvento)
        {
            List<ObjetoAsistente> ListaObjetos = new List<ObjetoAsistente>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneAsistentes_De_Evento";
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoAsistente obj = new ObjetoAsistente();
                    obj.AsistenteEventoID = query.GetInt32(0);
                    obj.EventoID = query.GetInt32(1);
                    obj.CiudadanoID = query.GetInt32(2);
                    obj.NombreCompleto = query.GetString(3);
                    obj.Asistencia = query.GetInt32(4);
                    obj.ColoniaID = query.GetInt32(5);
                    obj.Colonia = query.GetString(6);
                    obj.CalleID = query.GetInt32(7);
                    obj.Calle = query.GetString(8);
                    obj.Comentarios = query.GetString(9);
                    obj.Estatus = query.GetInt32(10);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
            Obtiene Lista de Archivos de un Evento
        *****************************************************************************/
        [HttpGet]
        public List<ObjetoArchivosEvento> ObtieneListaArchivosEvento(int idEvento)
        {
            List<ObjetoArchivosEvento> ListaObjetos = new List<ObjetoArchivosEvento>();
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpObtieneArchivosDeEventos";
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            SqlDataReader query = cmd.ExecuteReader();
            var contador = 0;
            if (query.HasRows)
            {
                while (query.Read())
                {
                    ObjetoArchivosEvento obj = new ObjetoArchivosEvento();
                    obj.EventoID = query.GetInt32(0);
                    obj.NombreArchivo = query.GetString(1);
                    obj.URL = query.GetString(2);
                    obj.ArchivoID = query.GetInt32(3);
                    ListaObjetos.Add(obj);
                    contador++;
                }
            }
            query.Close();
            conn.Close();
            return ListaObjetos;
        }


        /****************************************************************************
                    Subir Archivos Anexos de un Evento
        *****************************************************************************/
        [Microsoft.AspNetCore.Mvc.HttpPost]
        [RequestSizeLimit(100_000_000)]
        public Microsoft.AspNetCore.Mvc.JsonResult SubirArchivoEvento(List<IFormFile> files, int EventoId)
        {
            bool isSuccess = false;
            string serverMessage;
            string nombreArchivoBD;
            string nombreArchivo;
            string extensionArchivo;
            string filePath;
            int posicionPunto;
            foreach (IFormFile item in files)
            {
                if (item.Length > 0)
                {
                    //subPath = numeroTurno;
                    nombreArchivo = item.FileName;
                    posicionPunto = item.FileName.IndexOf(".");
                    extensionArchivo = item.FileName.Substring(posicionPunto + 1);

                    nombreArchivoBD = TokenProvider.ComputeSha256Hash(Convert.ToString(EventoId) + "_" + numeroArchivosXeventoId(EventoId)) + "." + extensionArchivo;

                    filePath = Path.Combine(@"C:\ARCHIVOS_APP\PETICIONES\EVENTOS\", nombreArchivoBD);

                    FileInfo fi = new FileInfo(filePath);

                    try
                    {
                        if (fi.Exists)
                        {
                            fi.Delete();
                        }
                    }
                    catch (Exception e)
                    {
                        ViewBag.EstatusError = "Si el archivo está abierto, debe cerrarse";
                        View("Error");
                    }

                    try
                    {
                        using (var stream = new FileStream(filePath, FileMode.Create))
                        {
                            item.CopyTo(stream);
                        }
                        var URL = "/Archivos/PETICIONES/EVENTOS/" + nombreArchivoBD;

                        GuardaReferenciaArchivoEventoBD(nombreArchivo, nombreArchivoBD, URL, EventoId);

                    }
                    catch
                    {
                        isSuccess = false;
                    }

                }
            }


            if (isSuccess)
            {
                isSuccess = true;
                serverMessage = "Los archivos han sido subidos";
            }
            else
            {
                isSuccess = false;

                serverMessage = "No fue posible subir los archivos";
            }
            return Json(new { IsSucccess = isSuccess, ServerMessage = serverMessage });
        }

        /*******************************************************************
            Obtiene el número de Archivos Peticion ID 
        ********************************************************************/
        public Int32 numeroArchivosXeventoId(int idDocumento)
        {
            SqlConnection conn_p = (SqlConnection)this._context.Database.GetDbConnection();
            conn_p.Open();
            string stm = "SELECT Count(*) FROM [dbo].[ArchivosEventos] WHERE EventoID = " + idDocumento;
            SqlCommand cmd_p = new SqlCommand(stm, conn_p);
            Int32 count = Convert.ToInt32(cmd_p.ExecuteScalar());
            conn_p.Close();
            return count + 1;
        }

        /****************************************************************************
            Guarda Referencia de Archivos INICIATIVA en Base de Datos
        *****************************************************************************/
        public string GuardaReferenciaArchivoEventoBD(string NombreArchivo, string NombreArchivoBD, string URL, int EventoId)
        {
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpRegistraNuevoArchivoEventos";
            cmd.Parameters.Add("@NombreArchivoBD", System.Data.SqlDbType.VarChar, 150).Value = NombreArchivoBD;
            cmd.Parameters.Add("@NombreArchivo", System.Data.SqlDbType.VarChar, 200).Value = NombreArchivo;
            cmd.Parameters.Add("@URL", System.Data.SqlDbType.VarChar, 500).Value = URL;
            cmd.Parameters.Add("@EventoId", System.Data.SqlDbType.Int).Value = EventoId;
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;

            try
            {
                SqlDataReader query = cmd.ExecuteReader();
                conn.Close();

                return "OK";
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return "NO";
            }
        }


        /****************************************************************************
            Guarda Nuevo Asistente a un Evento
        *****************************************************************************/
        [HttpPost]
        public int GuardaNuevoAsistente(int idEvento, int asistenteId, string comentarios, int cbAsisEvento)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpAgregaAsistenteEvento_Notas";
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@AsistenteID", System.Data.SqlDbType.Int).Value = asistenteId;
            cmd.Parameters.Add("@Comentario", System.Data.SqlDbType.VarChar, 1500).Value = comentarios??"";
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@Asistencia", System.Data.SqlDbType.Int).Value = cbAsisEvento;
            
            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        
        /****************************************************************************
        ACTUALIZA Asistente a un Evento
        *****************************************************************************/
        [HttpPost]
        public int ActualizaAsistenteEvento(int asistenteEventoID, int idEvento, int asistenteId, string comentarios, int cbAsisEvento)
        {
            int rtn;
            SqlConnection conn = (SqlConnection)this._context.Database.GetDbConnection();
            SqlCommand cmd = conn.CreateCommand();
            conn.Open();

            cmd.CommandType = System.Data.CommandType.StoredProcedure;
            cmd.CommandText = "stpACTUALIZAasistenteEvento_Notas";
            cmd.Parameters.Add("@AsistenteEventoID", System.Data.SqlDbType.Int).Value = asistenteEventoID;
            cmd.Parameters.Add("@EventoID", System.Data.SqlDbType.Int).Value = idEvento;
            cmd.Parameters.Add("@AsistenteID", System.Data.SqlDbType.Int).Value = asistenteId;
            cmd.Parameters.Add("@Comentario", System.Data.SqlDbType.VarChar, 1500).Value = comentarios ?? "";
            cmd.Parameters.Add("@UsuarioID", System.Data.SqlDbType.Int).Value = 1;
            cmd.Parameters.Add("@Asistencia", System.Data.SqlDbType.Int).Value = cbAsisEvento;

            cmd.Parameters.Add("@ReturnValue", System.Data.SqlDbType.Int).Direction = System.Data.ParameterDirection.Output;                // Parametro REGRESO DE VALORES DEL STORED PROCEDURE

            try
            {
                var nrow = cmd.ExecuteNonQuery();
                rtn = Convert.ToInt32(cmd.Parameters["@ReturnValue"].Value);
                conn.Close();
                if (nrow > 0)
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
            }
            catch (DbUpdateConcurrencyException)
            {
                conn.Close();
                return 0;
            }
        }

        public partial class ObjetoEventoTipoEstatus
        {
            public string Tipo { get; set; }
            public int SinEstatus { get; set; }
            public int Planeado { get; set; }
            public int Realizado { get; set; }
            public int Pospuesto { get; set; }
            public int Cancelado { get; set; }
            public int Total { get; set; }
        }

        public partial class ObjetoArchivosEvento
        {
            public int EventoID { get; set; }
            public string NombreArchivo { get; set; }
            public string URL { get; set; }
            public int ArchivoID { get; set; }
        }

        public partial class ObjetoEvento
        {
            public int EventoId { get; set; }
            public int? LegislaturaId { get; set; }
            public string NombreLegislatura { get; set; }
            public string Folio { get; set; }
            public int? EstatusId { get; set; }
            public int? NumAsistentes { get; set; }
            public DateTime? FechaEvento { get; set; }
            public string Tipo { get; set; }
            public int? ColoniaId { get; set; }
            public string Colonia { get; set; }
            public int? CalleId { get; set; }
            public string Calle { get; set; }
            public string NumExterior { get; set; }
            public string NumInterior { get; set; }
            public int? CP { get; set; }
            public string Latitud { get; set; }
            public string Longitud { get; set; }
            public string NombreEvento { get; set; }
            public string Lugar { get; set; }
            public string HoraInicio { get; set; }
        }

        public partial class ObjetoAsistente
        {
            public int AsistenteEventoID { get; set; }
            public int EventoID { get; set; }
            public int CiudadanoID { get; set; }
            public string NombreCompleto { get; set; }
            public int Asistencia { get; set; }
            public int ColoniaID { get; set; }
            public string Colonia { get; set; }
            public int CalleID { get; set; }
            public string Calle { get; set; }
            public string Comentarios { get; set; }
            public int Estatus { get; set; }
        }

    }
}
